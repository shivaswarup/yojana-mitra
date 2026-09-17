import { GoogleGenAI } from '@google/genai';

function getGenAI() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    } else if (!body) {
      body = {};
    }

    const { query = '', state = 'All India', category = 'All', userProfile = null } = body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(200).json({
        summary: `Search for "${query}" across official government portals like myScheme.gov.in and National Scholarship Portal.`,
        groundingUrls: []
      });
    }

    const prompt = `Search for official Indian central or state government schemes or scholarships matching: "${query}".
State context: ${state}
Category: ${category}
Provide genuine active government schemes with official government portal application links (.gov.in / .nic.in).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const groundingChunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const urls = [];
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web?.uri) {
          urls.push({
            title: chunk.web.title || 'Official Government Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    return res.status(200).json({
      summary: response?.text || 'Official schemes matching your query are active. Please check myscheme.gov.in or scholarships.gov.in.',
      groundingUrls: urls
    });
  } catch (err) {
    console.error('Error in /api/ai/search-schemes:', err);
    return res.status(200).json({
      summary: 'Please search directly on myscheme.gov.in or scholarships.gov.in.',
      groundingUrls: []
    });
  }
}
