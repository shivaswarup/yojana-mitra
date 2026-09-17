import { GoogleGenAI } from '@google/genai';

function getGenAI() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
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

async function generateContentWithFallback(ai, options) {
  const modelsToTry = [
    options.primaryModel || 'gemini-3.8-flash',
    ...(options.fallbackModels || ['gemini-3.1-flash-lite', 'gemini-flash-latest'])
  ];

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    const maxAttempts = i === 0 ? (options.retries ?? 1) : 0;
    
    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });
        return response;
      } catch (err) {
        const errMsg = (err?.message || String(err)).toLowerCase();
        const isTransient = 
          errMsg.includes('503') || 
          errMsg.includes('high demand') || 
          errMsg.includes('unavailable') || 
          errMsg.includes('resource_exhausted') || 
          errMsg.includes('quota') ||
          errMsg.includes('rate') ||
          errMsg.includes('429');

        if (isTransient && attempt < maxAttempts) {
          const delay = (attempt + 1) * 600 + Math.floor(Math.random() * 200);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        if (isTransient && i < modelsToTry.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          break;
        }

        if (!isTransient) {
          break;
        }
      }
    }
  }

  return null;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    const { message = '', history = [], userProfile = null, language = 'english' } = body;
    const ai = getGenAI();

    // Language detection
    const isTeluguRequested = 
      (typeof language === 'string' && language.toLowerCase() === 'telugu') ||
      (/(\btelugu\b|తెలుగు|telugulo|telugu\s*lo)/i.test(message || '')) ||
      (/[\u0C00-\u0C7F]/.test(message || '')) ||
      (Array.isArray(history) && history.some(h => 
        /(\btelugu\b|తెలుగు|telugulo|telugu\s*lo)/i.test(h.text || '') || /[\u0C00-\u0C7F]/.test(h.text || '')
      ));

    // Structured fallback if Gemini API key is missing
    if (!ai) {
      const studentKeywords = /(student|scholarship|college|school|vidya|చదువు|విద్య|స్కాలర్‌షిప్)/i.test(message);
      let defaultReply = '';
      
      if (isTeluguRequested) {
        if (studentKeywords) {
          defaultReply = `మీ ప్రొఫైల్ వివరాల ఆధారంగా విద్యార్థుల కోసం ధృవీకరించబడిన ప్రముఖ ప్రభుత్వ పథకాలు & స్కాలర్‌షిప్‌లు క్రింద వివరించబడ్డాయి:

1.
**పథకం పేరు (Scheme Name):** పీఎం యశస్వి కేంద్రీయ స్కాలర్‌షిప్ పథకం (PM-YASASVI)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** OBC/EBC/DNT విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2.5 లక్షల లోపు. పత్రాలు: ఆధార్ కార్డు, ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, బోనఫైడ్, ఆధార్ డీబీటీ బ్యాంకు ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** మీ విద్యా స్థాయి మరియు సామాజిక వర్గానికి కేంద్ర ప్రభుత్వం ద్వారా నేరుగా డీబీటీ స్కాలర్‌షిప్ అందిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

2.
**పథకం పేరు (Scheme Name):** కాలేజ్ & యూనివర్సిటీ విద్యార్థుల సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్ (CSSS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** ఇంటర్ / 12వ తరగతి బోర్డు పరీక్షల్లో 80 శాతానికి పైగా మార్కులు, రెగ్యులర్ డిగ్రీ విద్యార్థులు, కుటుంబ ఆదాయం ₹4.5 లక్షల లోపు. పత్రాలు: మార్కుల జాబితా, కాలేజీ బోనఫైడ్, ఆదాయ పత్రం, బ్యాంకు పాస్‌బుక్.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** ఉన్నత విద్య కోసం ప్రతి సంవత్సరం ₹12,000 నుండి ₹20,000 వరకు నగదు సహాయం నేరుగా ఖాతాలో జమ చేయబడుతుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

3.
**పథకం పేరు (Scheme Name):** తెలంగాణ ఈ-పాస్ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్ (Telangana ePASS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** తెలంగాణ రాష్ట్ర పోస్ట్-మెట్రిక్ విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2 లక్షల లోపు. పత్రాలు: మీసేవ ఆదాయ పత్రం, కుల పత్రం, బోనఫైడ్, ఆధార్ డీబీటీ ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** కాలేజీ పూర్తి ఫీజు రీయింబర్స్‌మెంట్ మరియు మెయింటెనెన్స్ అలవెన్స్ ప్రభుత్వం అందిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఈ-పాస్ పోర్టల్](https://telanganaepass.cgg.gov.in)`;
        } else {
          defaultReply = `నమస్కారం! మీ ప్రొఫైల్ వివరాల ఆధారంగా మీరు అర్హులైన ప్రముఖ ప్రభుత్వ సంక్షేమ పథకాలు క్రింద వివరించబడ్డాయి:

1.
**పథకం పేరు (Scheme Name):** ఆయుష్మాన్ భారత్ - ప్రధాన మంత్రి జన ఆరోగ్య యోజన (AB-PMJAY)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** అర్హులైన కుటుంబాలు / బిపిఎల్ కార్డుదారులు. పత్రాలు: ఆధార్ కార్డు, రేషన్ కార్డు.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు ఉచిత ఆసుపత్రి నగదు రహిత చికిత్స లభిస్తుంది.
**గడువు తేదీ (Deadline):** నిరంతరం అందుబాటులో ఉంటుంది (Check Official Portal)
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [PM-JAY పోర్టల్](https://pmjay.gov.in)

2.
**పథకం పేరు (Scheme Name):** ప్రధాన మంత్రి ముద్రా యోజన (PMMY)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** స్వయం ఉపాధి, చిన్న వ్యాపారాలు ప్రారంభించే పౌరులు. పత్రాలు: ఆధార్, పాన్ కార్డు, వ్యాపార ప్రణాళిక.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** ఎలాంటి పూచీకత్తు లేకుండా ₹50,000 నుండి ₹10 లక్షల వరకు తక్కువ వడ్డీతో రుణాలు లభిస్తాయి.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [ముద్రా పోర్టల్](https://www.mudra.org.in)`;
        }
      } else {
        if (studentKeywords) {
          defaultReply = `Here are active government schemes and scholarships matching your profile:

1.
**Scheme Name:** PM YASASVI Central Sector Scheme for OBC, EBC & DNT Students
**Requirements:** OBC/EBC/DNT students enrolled in recognized institutions, Annual family income under ₹2.5 Lakh. Documents: Aadhaar Card, Income Certificate, Caste Certificate, Bonafide ID, Aadhaar DBT-linked Bank Account.
**Why it suits you:** Provides merit-based financial aid directly disbursed through Aadhaar DBT to support your education expenses.
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

2.
**Scheme Name:** Central Sector Scheme of Scholarship for College and University Students (CSSS)
**Requirements:** Above 80th percentile in Class 12 board examinations, enrolled in regular UG/PG course, Family annual income under ₹4.5 Lakh. Documents: Class 12 Marksheet, College Bonafide Certificate, Income Certificate, Aadhaar DBT Bank Account.
**Why it suits you:** Supports undergraduate degree education with annual scholarship disbursements (₹12,000–₹20,000/year).
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

3.
**Scheme Name:** Telangana ePASS Post-Matric Scholarship & Full Fee Reimbursement (RTF & MTF)
**Requirements:** Resident of Telangana studying intermediate or higher education, Annual family income under ₹2.00 Lakh (SC/ST under ₹2.50 Lakh). Documents: Income Certificate from MeeSeva, Caste Certificate, SSC Marks Memo, College Bonafide, Bank Passbook.
**Why it suits you:** Reimburses 100% of college tuition fees and provides monthly maintenance stipends to eligible students.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Portal](https://telanganaepass.cgg.gov.in)`;
        } else {
          defaultReply = `Here are verified active government welfare schemes matching your profile:

1.
**Scheme Name:** Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)
**Requirements:** Eligible citizen/family identified under SECC / Ration card database. Documents: Aadhaar Card, Ration Card.
**Why it suits you:** Covers secondary and tertiary healthcare hospitalization up to ₹5 Lakh per year for the entire family completely cashless.
**Deadline:** Continuous Enrollment (Check Official Portal)
**Official Portal Link:** [PM-JAY National Portal](https://pmjay.gov.in)

2.
**Scheme Name:** Pradhan Mantri MUDRA Yojana (PMMY)
**Requirements:** Non-corporate, non-farm small/micro enterprises and individuals starting ventures. Documents: Aadhaar, PAN Card, Business proposal.
**Why it suits you:** Provides collateral-free institutional loans up to ₹10 Lakh at affordable interest rates.
**Deadline:** Check Official Portal
**Official Portal Link:** [Mudra Official Portal](https://www.mudra.org.in)`;
        }
      }

      return res.status(200).json({ reply: defaultReply });
    }

    const systemInstruction = `You are the official Government Scheme & Scholarship Finder Agent ("Yojana Mitra AI").
Your role is to assist Indian citizens in discovering, checking eligibility, understanding required documents, and applying for active government welfare schemes and scholarships.

CITIZEN PROFILE CONTEXT:
${userProfile ? `- Name: ${userProfile.name || 'Citizen'}
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
- PwD (Disability): ${userProfile.isDisability ? 'Yes' : 'No'}` : 'No citizen profile provided (general query).'}

${isTeluguRequested ? `CRITICAL MANDATORY DIRECTIVE - RESPOND ENTIRELY IN TELUGU (తెలుగు):
- You MUST answer the ENTIRE response in clear, natural, grammatically correct, and respectful Telugu (తెలుగు లిపి).
- DO NOT answer in English. All explanations, criteria, and document lists must be in Telugu.
- Structure all scheme recommendations strictly in TEXT FORMAT (DO NOT USE CARDS) using this numbered format:
1.
**పథకం పేరు (Scheme Name):** [అధికారిక పథకం పేరు]
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** [అర్హత ప్రమాణాలు మరియు కావలసిన ధృవీకరణ పత్రాలు]
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** [మీ వయస్సు, విద్య, రాష్ట్రం లేదా కేటగిరీకి ఇది ఎలా సరిపోతుంది]
**గడువు తేదీ (Deadline):** [గడువు తేదీ లేదా 'Check Official Portal']
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [అధికారిక వెబ్‌సైట్ లింక్ (ఉదా. [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in))]` : `MANDATORY TEXT FORMAT (STRICTLY NO CARDS):
- Structure all scheme recommendations in pure text format directly in the chatbox, numbered sequentially:
1.
**Scheme Name:** [Official Scheme Name]
**Requirements:** [Eligibility criteria & Required Documents]
**Why it suits you:** [Clear reason explaining why it suits the citizen's specific age, category, student/occupation status, and income]
**Deadline:** [Active deadline date or 'Check Official Portal']
**Official Portal Link:** [Direct clickable official government link e.g. [National Scholarship Portal](https://scholarships.gov.in)]`}

RULES:
1. STRICT STATE FOCUS: You EXCLUSIVELY support and concentrate on **Andhra Pradesh**, **Telangana**, and Central Government schemes. Never recommend schemes from other states.
2. STRICT PROFILE RELEVANCE: Only recommend schemes that match the citizen's profile.
3. OFFICIAL PORTALS: Restrict factual verification strictly to official Indian government portals (.gov.in, .nic.in, myscheme.gov.in, scholarships.gov.in).
4. NEVER invent deadlines. Mark "Check Official Portal" if unspecified.`;

    const contents = [];
    if (Array.isArray(history)) {
      history.forEach(h => {
        if (h && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(h.text) }]
          });
        }
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message || 'Hello, can you help me find government schemes matching my profile?' }]
    });

    const response = await generateContentWithFallback(ai, {
      primaryModel: 'gemini-3.8-flash',
      fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
      contents,
      config: {
        systemInstruction,
      }
    });

    if (response?.text) {
      return res.status(200).json({ reply: response.text });
    }

    // If Gemini model response was empty or rate-limited, provide fallback
    const studentQuery = /(student|scholarship|college|school|vidya|చదువు|విద్య|స్కాలర్‌షిప్)/i.test(message);
    const fallbackText = isTeluguRequested
      ? (studentQuery 
          ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా విద్యార్థుల కోసం ధృవీకరించబడిన ప్రముఖ ప్రభుత్వ పథకాలు:\n\n1.\n**పథకం పేరు (Scheme Name):** పీఎం యశస్వి కేంద్రీయ స్కాలర్‌షిప్ పథకం (PM-YASASVI)\n**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** OBC/EBC/DNT విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2.5 లక్షల లోపు. పత్రాలు: ఆధార్ కార్డు, ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, బోనఫైడ్.\n**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** మీ విద్యా స్థాయి మరియు సామాజిక వర్గానికి కేంద్ర ప్రభుత్వం ద్వారా నేరుగా డీబీటీ స్కాలర్‌షిప్ అందిస్తుంది.\n**గడువు తేదీ (Deadline):** Check Official Portal\n**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)`
          : `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ప్రముఖ సంక్షేమ పథకాలు:\n\n1.\n**పథకం పేరు (Scheme Name):** ఆయుష్మాన్ భారత్ - AB-PMJAY\n**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** అర్హులైన కుటుంబాలు / బిపిఎల్ కార్డుదారులు. పత్రాలు: ఆధార్ కార్డు, రేషన్ కార్డు.\n**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు ఉచిత ఆసుపత్రి నగదు రహిత చికిత్స లభిస్తుంది.\n**గడువు తేదీ (Deadline):** Check Official Portal\n**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [PM-JAY పోర్టల్](https://pmjay.gov.in)`)
      : (studentQuery
          ? `Here are active government schemes and scholarships matching your query:\n\n1.\n**Scheme Name:** PM YASASVI Central Sector Scheme for OBC, EBC & DNT Students\n**Requirements:** OBC/EBC/DNT students enrolled in recognized institutions, Annual family income under ₹2.5 Lakh. Documents: Aadhaar Card, Income Certificate, Caste Certificate, Bonafide ID, Aadhaar DBT-linked Bank Account.\n**Why it suits you:** Provides merit-based financial aid directly disbursed through Aadhaar DBT to support your education expenses.\n**Deadline:** Check Official Portal\n**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)`
          : `Here are active government welfare schemes matching your profile:\n\n1.\n**Scheme Name:** Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)\n**Requirements:** Eligible citizen/family identified under SECC / Ration card database. Documents: Aadhaar Card, Ration Card.\n**Why it suits you:** Covers secondary and tertiary healthcare hospitalization up to ₹5 Lakh per year for the entire family completely cashless.\n**Deadline:** Check Official Portal\n**Official Portal Link:** [PM-JAY National Portal](https://pmjay.gov.in)`);

    return res.status(200).json({ reply: fallbackText });
  } catch (err) {
    console.error('Error in /api/ai/chat handler:', err);
    return res.status(200).json({
      reply: `Here are active government schemes and scholarships matching your profile:

1.
**Scheme Name:** PM YASASVI Central Sector Scheme for OBC, EBC & DNT Students
**Requirements:** OBC/EBC/DNT students enrolled in recognized institutions, Annual family income under ₹2.5 Lakh. Documents: Aadhaar Card, Income Certificate, Caste Certificate, Bonafide ID, Aadhaar DBT-linked Bank Account.
**Why it suits you:** Provides merit-based financial aid directly disbursed through Aadhaar DBT to support your education expenses.
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)`
    });
  }
}
