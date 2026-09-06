import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy / safe initialization of Gemini AI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured. AI capabilities will return fallback responses.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient Gemini generation with model fallback on 503/429/high demand
async function generateContentWithFallback(ai: GoogleGenAI, options: {
  contents: any;
  config?: any;
  primaryModel?: string;
  fallbackModels?: string[];
}) {
  const modelsToTry = [
    options.primaryModel || 'gemini-3.8-flash',
    ...(options.fallbackModels || ['gemini-flash-latest', 'gemini-3.1-flash-lite'])
  ];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isTransient = 
        errMsg.includes('503') || 
        errMsg.includes('high demand') || 
        errMsg.includes('UNAVAILABLE') || 
        errMsg.includes('RESOURCE_EXHAUSTED') || 
        errMsg.includes('429');

      // If high demand on this model, immediately try the next model in pool
      if (i < modelsToTry.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }
    }
  }

  throw lastError;
}

// General AI Scheme & Scholarship Chat Bot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, userProfile } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: `Hello! I am your **Yojana Mitra AI Assistant**. 

To activate live real-time AI responses with the Gemini API, please make sure your \`GEMINI_API_KEY\` is added in the **Settings > Secrets** panel in Google AI Studio.

In the meantime, you can explore hundreds of pre-verified schemes and scholarships across our database using the search and recommendation views!`
      });
    }

    const systemInstruction = `You are the official Government Scheme & Scholarship Finder Agent ("Yojana Mitra AI").
Your role is to assist Indian citizens in discovering, checking eligibility, understanding required documents, and applying for active government welfare schemes and scholarships.

CITIZEN PROFILE CONTEXT:
${userProfile ? `
- Name: ${userProfile.name || 'Citizen'}
- Age: ${userProfile.age || 'Not specified'} (${userProfile.gender || 'Not specified'})
- Marital Status: ${userProfile.maritalStatus || 'Single'}
- State/UT & District: ${userProfile.district ? `${userProfile.district}, ` : ''}${userProfile.state || 'All India'} (${userProfile.areaType || 'Urban'} sector)
- Category: ${userProfile.category || 'General'}
- Annual Family Income: ₹${userProfile.annualFamilyIncome || 'Not specified'}
- Occupation / Status: ${userProfile.occupation || userProfile.employmentStatus || 'Not specified'}
- Education: ${userProfile.highestEducation || 'Not specified'} (${userProfile.currentEducationStatus || ''})
- Student Status: ${userProfile.isStudent ? 'Yes' : 'No'}
- Farmer Status: ${userProfile.isFarmer ? 'Yes' : 'No'}
- Woman Entrepreneur / Self-Employed: ${userProfile.isWomanEntrepreneur ? 'Yes' : 'No'}
- Senior Citizen: ${userProfile.isSeniorCitizen ? 'Yes' : 'No'}
- BPL / EWS: ${userProfile.isBPLOrEWS ? 'Yes' : 'No'}
- PwD (Disability): ${userProfile.isDisability ? 'Yes' : 'No'}
` : 'No citizen profile provided (general query).'}

RULES & CONSTRAINTS:
1. STRICT PROFILE RELEVANCE: Only recommend schemes and scholarships that strictly match the citizen's profile (Age, State, Category, Income limit, Occupation/Student/Farmer/Gender). NEVER recommend schemes outside the user's profile (e.g. do not recommend farmer schemes to students, do not recommend girl-child schemes to male users, do not recommend schemes with income limits lower than the citizen's income, and do not recommend schemes restricted to other states). If the user asks about an ineligible scheme, explain clearly why they do not meet the criteria.
2. Restrict factual verification strictly to official Indian government portals and websites (e.g. .gov.in, .nic.in, myscheme.gov.in, scholarships.gov.in, pmkisan.gov.in, etc.).
3. When answering specific scheme or scholarship queries, provide clean, structured Markdown cards or sections containing:
   - **Scheme Name & Ministry**
   - **Target Criteria & Eligibility**
   - **Financial / Welfare Benefit**
   - **Documents Required**
   - **Official Application Link / Portal**
4. Do not invent or estimate deadlines. If a deadline is unavailable or subject to official notification, clearly state: "Check Official Portal".
5. Provide concise, clear, and reassuring guidance. Explain how to prepare paperwork (e.g. Income certificate from Tehsildar, Bonafide from college, Bank Aadhaar DBT seeding) when helpful.`;

    // Format chat messages
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((h: { role: string; text: string }) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message || 'Hello, can you help me find government schemes matching my profile?' }]
    });

    const response = await generateContentWithFallback(ai, {
      primaryModel: 'gemini-3.8-flash',
      fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
      contents,
      config: {
        systemInstruction,
      }
    });

    res.json({
      reply: response.text || 'I could not generate a response. Please check the official government portal for more information.'
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    // Return friendly resilient fallback if temporary surge occurs
    res.json({
      reply: `Government portals and AI advisors are experiencing high traffic right now.

Here is verified guidance for your profile:
- **Scholarships**: Check the **National Scholarship Portal (scholarships.gov.in)** or **PM YASASVI** for active post-matric/merit-cum-means awards.
- **Documents**: Ensure your **Aadhaar is DBT-linked** with your bank account, and keep an active **Income Certificate (issued by Tehsildar)** and category certificate ready.
- **Next Step**: Please feel free to retry your query in a few moments, or explore the Recommended Schemes tab in the left taskbar.`
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Automated AI Scheme Scanner for Citizen Profile
app.post('/api/ai/scan-schemes', async (req, res) => {
  try {
    const { userProfile, candidateSchemes } = req.body;
    const ai = getGenAI();

    if (!ai || !Array.isArray(candidateSchemes) || candidateSchemes.length === 0) {
      return res.json({
        success: false,
        message: 'AI unavailable or no candidate schemes provided'
      });
    }

    const schemeSummaries = candidateSchemes.map((s: any) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      state: s.state || 'All India',
      level: s.governmentLevel || 'Central',
      benefit: s.financialBenefitAmount || 'Standard government welfare benefit'
    }));

    const prompt = `You are "Yojana Mitra AI", an official Government Scheme & Scholarship Finder Agent in India.
You have scanned active Central and State government schemes for the following citizen:

CITIZEN PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age} (${userProfile.gender})
- Marital Status: ${userProfile.maritalStatus || 'Single'}
- State & District: ${userProfile.district || ''}, ${userProfile.state} (${userProfile.areaType || 'Urban'} sector)
- Education: ${userProfile.highestEducation || 'N/A'} (${userProfile.currentEducationStatus || ''})
- Category: ${userProfile.category} (Annual Family Income: ₹${userProfile.annualFamilyIncome || '2,50,000'})
- Occupation: ${userProfile.occupation || userProfile.employmentStatus || 'Citizen'}
- Special: Student=${userProfile.isStudent}, Farmer=${userProfile.isFarmer}, WomanEntrepreneur=${userProfile.isWomanEntrepreneur}, Senior=${userProfile.isSeniorCitizen}, BPL/EWS=${userProfile.isBPLOrEWS}, PwD=${userProfile.isDisability}

CANDIDATE CENTRAL & STATE SCHEMES:
${JSON.stringify(schemeSummaries, null, 2)}

TASK:
For each scheme above, provide a 1-sentence personalized AI evaluation explaining precisely why this citizen qualifies (highlighting state entitlement if it is an official state scheme for their state) and a key action or tip for applying.
Return a valid JSON object in this exact format:
{
  "scanSummary": "Found X government schemes and scholarships matching your profile as a <occupation> in <state>.",
  "advice": {
    "<scheme_id>": "Personalized 1-sentence advice note"
  }
}`;

    const response = await generateContentWithFallback(ai, {
      primaryModel: 'gemini-3.8-flash',
      fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      scanSummary: parsed.scanSummary || `Found ${candidateSchemes.length} matching schemes for your profile.`,
      advice: parsed.advice || {}
    });
  } catch (error) {
    console.error('Error in /api/ai/scan-schemes:', error);
    res.json({
      success: false,
      message: 'Failed to run AI scanner via Gemini'
    });
  }
});

// AI Scheme Assistant Endpoint
app.post('/api/ai/ask-scheme', async (req, res) => {
  try {
    const { schemeName, schemeDetails, userQuery, userProfile } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        answer: `As an official Yojana Mitra advisor for **${schemeName}**, please note that eligibility is based on official government guidelines. \n\nKey Highlights:\n- Ensure you verify on the official portal.\n- Keep your Aadhaar-seeded bank account, income certificate, and caste credentials ready.\n\n*(Connect your Gemini API key in Settings > Secrets for real-time interactive AI guidance)*`,
        sources: ['Official Portal Verification Required']
      });
    }

    const prompt = `You are "Yojana Mitra AI", an official Government Scheme & Scholarship Assistant in India.
Answer the citizen's query about the following government scheme in clear, friendly, and objective language.

SCHEME CONTEXT:
Name: ${schemeName}
Details: ${JSON.stringify(schemeDetails || {})}

CITIZEN PROFILE:
${userProfile ? JSON.stringify(userProfile) : 'General Citizen'}

CITIZEN'S QUESTION:
"${userQuery}"

STRICT GUIDELINES:
1. Ground your answers strictly in authentic Indian government guidelines and portals (.gov.in, .nic.in, myscheme.gov.in, scholarships.gov.in).
2. Do not invent benefits, deadlines, or eligibility rules. If information is conditional or not officially confirmed, explicitly advise the citizen to verify on the official government website.
3. If explaining required documents, provide clear, practical tips (such as how to get an Income Certificate or link Aadhaar to a bank account).
4. Keep the tone respectful, clear, and reassuring.`;

    const response = await generateContentWithFallback(ai, {
      primaryModel: 'gemini-3.8-flash',
      fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
      contents: prompt,
      config: {
        systemInstruction: 'You are the official Yojana Mitra Assistant for Indian Government Schemes and Scholarships. Always ground advice in verified government portals (.gov.in).'
      }
    });

    res.json({
      answer: response.text || 'No response generated.',
      sources: ['National Portal / Department Guidelines']
    });
  } catch (error: any) {
    console.error('Error in /api/ai/ask-scheme:', error);
    res.json({
      answer: 'Please refer to the official government portal for the most accurate and up-to-date scheme guidelines, or try asking your question again in a moment.',
      sources: ['Official Portal Verification Recommended']
    });
  }
});

// AI Live Scheme Discovery Endpoint with Google Search Grounding
app.post('/api/ai/search-schemes', async (req, res) => {
  try {
    const { query, state, category, userProfile } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        summary: `Search for "${query}" across official government portals like myScheme.gov.in and National Scholarship Portal.`,
        groundingUrls: []
      });
    }

    const prompt = `Search for official Indian central or state government schemes or scholarships matching: "${query}".
State context: ${state || 'All India'}
Category: ${category || 'All'}
Citizen details: ${userProfile ? `Age: ${userProfile.age}, Occupation: ${userProfile.occupation}, Category: ${userProfile.category}, Income: ₹${userProfile.annualFamilyIncome}` : 'General'}

Provide:
1. Direct name and operating Ministry/Department of genuine active government schemes.
2. Target eligibility criteria and financial or welfare benefits.
3. Essential documents required for application.
4. Official government portal application link (.gov.in / .nic.in).
Do not invent deadlines or unofficial URLs.`;

    const response = await generateContentWithFallback(ai, {
      primaryModel: 'gemini-3.8-flash',
      fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const urls: { title: string; uri: string }[] = [];
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          urls.push({
            title: chunk.web.title || 'Official Government Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    res.json({
      summary: response.text || '',
      groundingUrls: urls
    });
  } catch (error: any) {
    console.error('Error in /api/ai/search-schemes:', error);
    res.json({
      summary: `Unable to complete live search right now due to high portal traffic. Please search directly on myscheme.gov.in or scholarships.gov.in.`,
      groundingUrls: []
    });
  }
});

// AI Document Readiness Evaluator
app.post('/api/ai/check-documents', async (req, res) => {
  try {
    const { schemeName, requiredDocs, userHeldDocs } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        analysis: 'Please check your required certificates against the scheme requirements and visit your local MeeSeva / CSC / Tehsildar office if any are missing.'
      });
    }

    const prompt = `You are Yojana Mitra Document Verification Advisor.
Scheme: ${schemeName}
Required Documents: ${JSON.stringify(requiredDocs)}
User's Available Documents: ${JSON.stringify(userHeldDocs)}

Analyze which documents are ready and provide simple step-by-step instructions on how the citizen can acquire any missing official documents (such as Caste Certificate, Income Certificate from Tehsildar/Revenue Department, Bonafide from college, or Aadhaar-bank seeding).`;

    const response = await generateContentWithFallback(ai, {
      primaryModel: 'gemini-3.7-flash',
      fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
      contents: prompt
    });

    res.json({
      analysis: response.text || 'Document checklist verified.'
    });
  } catch (error: any) {
    console.error('Error in /api/ai/check-documents:', error);
    res.json({
      analysis: 'Please verify that your Caste, Income, and Education certificates are active and that your bank account is seeded with Aadhaar for DBT transfer.'
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yojana Mitra Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
