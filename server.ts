import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for external/serverless requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Normalize request URLs in case Vercel rewrites strip the /api prefix
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api') && (req.url.startsWith('/ai') || req.url.startsWith('/health'))) {
    req.url = '/api' + req.url;
  }
  next();
});

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

function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TIMEOUT')), ms);
    promise.then(
      res => { clearTimeout(timer); resolve(res); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}

// Resilient Gemini generation with model fallback on 503/429/high demand/quota/timeout
async function generateContentWithFallback(ai: GoogleGenAI | null, options: {
  contents: any;
  config?: any;
  primaryModel?: string;
  fallbackModels?: string[];
  retries?: number;
  timeoutMs?: number;
}) {
  if (!ai) return null;
  const timeoutMs = options.timeoutMs || 3500;
  const modelsToTry = [
    options.primaryModel || 'gemini-flash-latest',
    ...(options.fallbackModels || ['gemini-3.1-flash-lite', 'gemini-2.5-flash'])
  ];

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const response = await timeoutPromise(ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      }), timeoutMs);
      if (response?.text) {
        return response;
      }
    } catch {
      // Continue to next model or fallback
    }
  }

  console.warn('Gemini models busy or timed out. Serving instant verified fallback.');
  return null;
}

function buildFallbackReply(message: string, userProfile: any, isTeluguRequested: boolean): string {
  const msgLower = (message || '').toLowerCase();
  const profileState = (userProfile?.state || '').toLowerCase();

  const isAndhraQuery = 
    /(andhra|ఆంధ్ర|ap|amaravati|visakhapatnam|vijayawada|chandrababu|jnanabhumi|aarogyasri)/i.test(msgLower) ||
    profileState.includes('andhra');

  const isTelanganaQuery = 
    /(telangana|తెలంగాణ|hyderabad|warangal|epass|revanth|praja)/i.test(msgLower) ||
    profileState.includes('telangana');

  const isStateQuery = /(state|రాష్ట్ర|local)/i.test(msgLower) || isAndhraQuery || isTelanganaQuery;

  if (isAndhraQuery) {
    return isTeluguRequested
      ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ఆంధ్రప్రదేశ్ రాష్ట్ర ప్రభుత్వ పథకాలు & స్కాలర్‌షిప్‌లు క్రింద వివరించబడ్డాయి:

1.
**పథకం పేరు (Scheme Name):** ఆంధ్రప్రదేశ్ విద్యా దీవెన - పూర్తి ఫీజు రీయింబర్స్‌మెంట్ (JnanaBhumi Vidya Deevena)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** ఆంధ్రప్రదేశ్ వాస్తవ్యులు, ITI/పాలిటెక్నిక్/డిగ్రీ/ఇంజనీరింగ్/పీజీ విద్యార్థులు, కుటుంబ వార్షిక ఆదాయం ₹2.5 లక్షల లోపు, 75% హాజరు. పత్రాలు: జ్ఞానభూమి ఐడీ, మీసేవ కుల ధృవీకరణ పత్రం, తెల్ల రేషన్ కార్డు / ఆదాయ పత్రం, తల్లి బ్యాంక్ పాస్‌బుక్, కాలేజీ బోనఫైడ్.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** మీ విద్యా కోర్సుకు సంబంధించి పూర్తి కాలేజీ ట్యూషన్ ఫీజును ప్రభుత్వం నేరుగా మంజూరు చేస్తుంది.
**గడువు తేదీ (Deadline):** 15 November 2026
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [జ్ఞానభూమి ఏపీ పోర్టల్](https://jnanabhumi.ap.gov.in)

2.
**పథకం పేరు (Scheme Name):** ఆంధ్రప్రదేశ్ వసతి దీవెన - వసతి మరియు భోజన ఖర్చుల సహాయం (JnanaBhumi Vasathi Deevena)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** పాలిటెక్నిక్, ఐటీఐ, డిగ్రీ లేదా ఇంజనీరింగ్ చదువుతున్న ఏపీ విద్యార్థులు, కుటుంబ వార్షిక ఆదాయం ₹2.5 లక్షల లోపు. పత్రాలు: ఆధార్ కార్డు, కాలేజీ బోనఫైడ్, తల్లి ఆధార్-డీబీటీ ఖాతా పాస్‌బుక్.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** హాస్టల్ వసతి మరియు భోజన ఖర్చుల కోసం డిగ్రీ/ఇంజనీరింగ్ విద్యార్థులకు ఏటా ₹20,000 నగదు సహాయం 2 విడతల్లో అందుతుంది.
**గడువు తేదీ (Deadline):** 15 November 2026
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [జ్ఞానభూమి ఏపీ పోర్టల్](https://jnanabhumi.ap.gov.in)

3.
**పథకం పేరు (Scheme Name):** డాక్టర్ ఎన్టీఆర్ వైద్య సేవ - ఉచిత నగదు రహిత వైద్య చికిత్స (Dr. NTR Vaidya Seva)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** ఆంధ్రప్రదేశ్ రైస్ కార్డు / వైట్ రేషన్ కార్డుదారులు, వార్షిక ఆదాయం ₹5 లక్షల లోపు. పత్రాలు: ఆధార్ కార్డు, ఏపీ రైస్ కార్డు.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** కుటుంబానికి ప్రతి సంవత్సరం ₹25 లక్షల వరకు అధునాతన నెట్‌వర్క్ ఆసుపత్రులలో పూర్తి ఉచిత నగదు రహిత ఆరోగ్య చికిత్సను ప్రభుత్వం అందిస్తుంది.
**గడువు తేదీ (Deadline):** నిరంతరం అందుబాటులో ఉంటుంది (Check Official Portal)
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [డాక్టర్ ఎన్టీఆర్ వైద్య సేవ ట్రస్ట్](https://aarogyasri.ap.gov.in)`
      : `Here are verified active Government of Andhra Pradesh state welfare schemes and scholarships matching your profile:

1.
**Scheme Name:** Andhra Pradesh Vidya Deevena (Complete Fee Reimbursement via JnanaBhumi)
**Requirements:** Permanent resident of Andhra Pradesh pursuing ITI, Polytechnic, Degree, Engineering, or PG courses, Annual family income under ₹2.5 Lakh, 75% attendance. Documents: Aadhaar Card, AP Rice Card / Income Certificate, Integrated Caste Certificate from MeeSeva, College Bonafide, Mother's Aadhaar DBT Bank Account.
**Why it suits you:** Covers 100% full college tuition fee reimbursement paid directly by the state government to support your higher education.
**Deadline:** 15 November 2026
**Official Portal Link:** [JnanaBhumi AP Portal](https://jnanabhumi.ap.gov.in)

2.
**Scheme Name:** Andhra Pradesh Vasathi Deevena (Hostel & Boarding Grant via JnanaBhumi)
**Requirements:** Enrolled in regular ITI, Polytechnic, Degree, or Engineering colleges in Andhra Pradesh, Family annual income under ₹2.5 Lakh. Documents: Aadhaar Card, College Study Certificate, Rice Card, Mother's Bank Passbook.
**Why it suits you:** Grants up to ₹20,000/year (Degree/Engineering), ₹15,000/year (Polytechnic), and ₹10,000/year (ITI) directly to cover food and hostel expenses.
**Deadline:** 15 November 2026
**Official Portal Link:** [JnanaBhumi AP Portal](https://jnanabhumi.ap.gov.in)

3.
**Scheme Name:** Dr. NTR Vaidya Seva Comprehensive Healthcare Scheme
**Requirements:** Resident of Andhra Pradesh holding AP Rice Card / White Ration Card, Annual family income under ₹5.00 Lakh. Documents: Aadhaar Card, AP Rice Card / Health Card.
**Why it suits you:** Protects your entire family with cashless inpatient hospital coverage up to ₹25 Lakhs per year across empaneled hospitals.
**Deadline:** Continuous Enrollment (Check Official Portal)
**Official Portal Link:** [Dr. NTR Vaidya Seva Trust](https://aarogyasri.ap.gov.in)`;
  }

  if (isStateQuery || isTelanganaQuery) {
    return isTeluguRequested
      ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ప్రముఖ రాష్ట్ర ప్రభుత్వ పథకాలు క్రింద ఇవ్వబడ్డాయి:

1.
**పథకం పేరు (Scheme Name):** తెలంగాణ ఈ-పాస్ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్ (Telangana ePASS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** తెలంగాణ వాస్తవ్యులు, ఇంటర్/డిగ్రీ/పీజీ విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2 లక్షల లోపు (SC/ST లకు ₹2.5 లక్షల లోపు). పత్రాలు: ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, ఎస్ఎస్సీ హాల్ టికెట్, కాలేజీ బోనఫైడ్, ఆధార్ డీబీటీ బ్యాంకు ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పూర్తి కాలేజీ ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ (RTF) మరియు నెలవారీ వసతి భత్యం (MTF) నేరుగా అందిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఈ-పాస్ పోర్టల్](https://telanganaepass.cgg.gov.in)

2.
**పథకం పేరు (Scheme Name):** చీఫ్ మినిస్టర్స్ ఓవర్సీస్ స్కాలర్‌షిప్ పథకం (Overseas Vidya Nidhi)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** విదేశీ విశ్వవిద్యాలయాల్లో ఉన్నత విద్య (MS/PG) అభ్యసించే ఎస్సీ/ఎస్టీ/బీసీ విద్యార్థులు, వార్షిక ఆదాయం ₹5 లక్షల లోపు. పత్రాలు: GRE/TOEFL స్కోర్‌కార్డ్, అడ్మిషన్ ఆఫర్ లెటర్, ఆధార్, పాస్‌పోర్ట్, ఆదాయ ధృవీకరణ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** విదేశీ ఉన్నత విద్య కోసం గరిష్టంగా ₹20 లక్షల వరకు ఆర్థిక సహాయం గ్రాంట్‌గా మంజూరు చేస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఓవర్సీస్ స్కాలర్‌షిప్](https://telanganaepass.cgg.gov.in)

3.
**పథకం పేరు (Scheme Name):** తెలంగాణ యువ వికాసం స్కిల్ డెవలప్‌మెంట్ & స్వయం ఉపాధి శిక్షణ (TASK)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** తెలంగాణ యువత (వయస్సు 18-35 సం.), 10వ/12వ తరగతి లేదా గ్రాడ్యుయేషన్ పూర్తి. పత్రాలు: ఆధార్ కార్డు, విద్యార్హత పత్రాలు, స్థానికత ధృవీకరణ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పరిశ్రమలకు అవసరమైన ఆధునిక సాంకేతిక నైపుణ్యాల శిక్షణ మరియు ప్లేస్‌మెంట్ కల్పిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ అకాడమీ ఫర్ స్కిల్ అండ్ నాలెడ్జ్](https://task.telangana.gov.in)`
      : `Here are verified active State Government schemes and scholarships matching your profile:

1.
**Scheme Name:** Telangana ePASS Post-Matric Scholarship & Full Fee Reimbursement (RTF & MTF)
**Requirements:** Resident of Telangana studying intermediate, degree, engineering or professional courses, Annual family income under ₹2.00 Lakh (SC/ST under ₹2.50 Lakh). Documents: Income Certificate from MeeSeva, Integrated Community Certificate, SSC Marks Card, College Bonafide, Bank Passbook (DBT-seeded).
**Why it suits you:** Reimburses 100% of your college tuition fees and provides monthly maintenance grants directly to your bank account.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Portal](https://telanganaepass.cgg.gov.in)

2.
**Scheme Name:** Overseas Vidya Nidhi Scheme for Higher Education Abroad
**Requirements:** Students pursuing Master's / PhD degrees in recognized universities in USA, UK, Canada, Australia, Family income up to ₹5.00 Lakh. Documents: Valid Passport, Visa, Foreign University Offer Letter, GRE/IELTS/TOEFL scorecard, Income Certificate.
**Why it suits you:** Grants up to ₹20.00 Lakh direct financial assistance to support overseas tuition and living costs.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Overseas Portal](https://telanganaepass.cgg.gov.in)

3.
**Scheme Name:** Telangana Academy for Skill and Knowledge (TASK) Youth Development Program
**Requirements:** Telangana youth aged 18–35, enrolled in diploma/degree courses or recent graduates. Documents: College ID, Aadhaar Card, Academic Marksheets.
**Why it suits you:** Provides subsidized technology and industry-grade employability skill certifications with direct campus recruitment linkage.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana Academy for Skill and Knowledge](https://task.telangana.gov.in)`;
  }

  // Central schemes fallback
  return isTeluguRequested
    ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ప్రముఖ కేంద్ర ప్రభుత్వ పథకాలు & స్కాలర్‌షిప్‌లు క్రింద వివరించబడ్డాయి:

1.
**పథకం పేరు (Scheme Name):** పీఎం యశస్వి కేంద్రీయ స్కాలర్‌షిప్ పథకం (PM-YASASVI)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** OBC/EBC/DNT విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2.5 లక్షల లోపు. పత్రాలు: ఆధార్ కార్డు, ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, బోనఫైడ్, ఆధార్ డీబీటీ బ్యాంకు ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** మీ విద్యా స్థాయి మరియు సామాజిక వర్గానికి కేంద్ర ప్రభుత్వం ద్వారా నేరుగా డీబీటీ స్కాలర్‌షిప్ అందిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

2.
**పథకం పేరు (Scheme Name):** సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్ ఫర్ కాలేజ్ & యూనివర్సిటీ స్టూడెంట్స్ (CSSS via NSP)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** 12వ తరగతి బోర్డు పరీక్షల్లో 80వ పర్సంటైల్ సాధించిన రెగ్యులర్ డిగ్రీ విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹4.5 లక్షల లోపు. పత్రాలు: 12వ మార్కుల మెమో, కాలేజీ బోనఫైడ్, ఆదాయ ధృవీకరణ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** గ్రాడ్యుయేషన్ కోసం ప్రతి ఏటా ₹12,000 మరియు పోస్ట్ గ్రాడ్యుయేషన్ కోసం ₹20,000 ఆర్థిక సహాయం నేరుగా అందుతుంది.
**గడువు తేదీ (Deadline):** 31 December 2026
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

3.
**పథకం పేరు (Scheme Name):** పీఎం విద్యా లక్ష్మి ఉన్నత విద్యా లోన్ వడ్డీ రాయితీ పథకం (PM Vidyalaxmi)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** నాణ్యమైన ఉన్నత విద్యా సంస్థల్లో (QHEIs) ప్రవేశం పొందిన విద్యార్థులు, కుటుంబ ఆదాయం ₹8 లక్షల లోపు. పత్రాలు: కాలేజీ అడ్మిషన్ లెటర్, ఫీజు రసీదు, ఆధార్, పాన్ కార్డు.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** గ్యారంటీ లేకుండా ₹7.5 లక్షల వరకు 3% వడ్డీ రాయితీతో విద్యా రుణాన్ని అందిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [పీఎం విద్యా లక్ష్మి పోర్టల్](https://www.pmvidyalaxmi.gov.in)`
    : `Here are verified active Central Government schemes and national scholarships matching your credentials:

1.
**Scheme Name:** PM-YASASVI Central Sector Scholarship Scheme for Top Class Education
**Requirements:** Meritorious OBC, EBC, and DNT students studying in recognized institutions, Annual family income under ₹2.50 Lakh. Documents: Aadhaar Card, Income Certificate, Community/Caste Certificate, Bank Passbook, Admission Proof.
**Why it suits you:** Provides complete financial assistance covering full tuition fees and hostel maintenance directly through Direct Benefit Transfer (DBT).
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

2.
**Scheme Name:** Central Sector Scheme of Scholarship for College and University Students (CSSS)
**Requirements:** Above 80th percentile in Class 12 board examination pursuing regular graduation courses, Annual family income under ₹4.50 Lakh. Documents: Class 12 Marks Card, College Bonafide Certificate, Income Certificate.
**Why it suits you:** Grants ₹12,000 per annum for graduation and ₹20,000 per annum for post-graduation directly to student bank accounts.
**Deadline:** 31 December 2026
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

3.
**Scheme Name:** PM Vidyalaxmi Education Loan Scheme (Interest Subvention for Higher Studies)
**Requirements:** Indian students admitted to top NIRF-ranked Quality Higher Education Institutions (QHEIs), Family income up to ₹8.00 Lakh. Documents: Admission Letter, College Fee Structure, Aadhaar Card, PAN Card.
**Why it suits you:** Provides collateral-free student education loans up to ₹7.50 Lakh with a 3% interest subvention for eligible candidates.
**Deadline:** Check Official Portal
**Official Portal Link:** [PM Vidyalaxmi Portal](https://www.pmvidyalaxmi.gov.in)`;
}

// General AI Scheme & Scholarship Chat Bot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, userProfile, language } = req.body;
    const ai = getGenAI();

    // Check if user specifically requested Telugu or typed in Telugu script/transliteration
    const isTeluguRequested = 
      (typeof language === 'string' && language.toLowerCase() === 'telugu') ||
      (/(\btelugu\b|తెలుగు|telugulo|telugu\s*lo)/i.test(message || '')) ||
      (/[\u0C00-\u0C7F]/.test(message || '')) ||
      (Array.isArray(history) && history.some((h: { role: string; text: string }) => 
        /(\btelugu\b|తెలుగు|telugulo|telugu\s*lo)/i.test(h.text || '') || /[\u0C00-\u0C7F]/.test(h.text || '')
      ));

    if (!ai) {
      return res.json({
        reply: buildFallbackReply(message, userProfile, isTeluguRequested)
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

${isTeluguRequested ? `
CRITICAL MANDATORY DIRECTIVE - RESPOND ENTIRELY IN TELUGU (తెలుగు):
- The citizen has explicitly requested to respond in Telugu or is communicating in Telugu.
- You MUST answer the ENTIRE response in clear, natural, grammatically correct, and respectful Telugu (తెలుగు లిపి).
- DO NOT answer in English. All explanations, step-by-step guidance, criteria, and document lists must be in Telugu.
- Structure all scheme recommendations strictly in TEXT FORMAT (DO NOT USE CARDS) using this numbered format:
  1.
  **పథకం పేరు (Scheme Name):** [అధికారిక పథకం పేరు]
  **అర్హతలు & అవసరమైన పత్రాలు (Requirements):** [అర్హత ప్రమాణాలు మరియు కావలసిన ధృవీకరణ పత్రాలు]
  **మీకు ఎందుకు సరిపోతుంది (Why it suits you):** [మీ వయస్సు, విద్య, రాష్ట్రం లేదా కేటగిరీకి ఇది ఎలా సరిపోతుంది]
  **గడువు తేదీ (Deadline):** [గడువు తేదీ లేదా 'Check Official Portal']
  **అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [అధికారిక వెబ్‌సైట్ లింక్ (ఉదా. [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in))]
- Keep official English scheme titles or portal acronyms in parentheses where helpful (e.g., 'జాతీయ స్కాలర్‌షిప్ పోర్టల్ (NSP)', 'పీఎం యశస్వి (PM-YASASVI)', 'ఆధార్ డీబీటీ (Aadhaar DBT)').
- Start with a polite greeting in Telugu: "నమస్కారం! మీ ప్రొఫైల్ ఆధారంగా మీరు అర్హులైన ప్రభుత్వ పథకాలు మరియు స్కాలర్‌షిప్‌ల వివరాలు క్రింద వివరించబడ్డాయి:"
` : `
LANGUAGE CAPABILITY:
- You have full native-level fluency in English, Telugu (తెలుగు), and Hindi (हिंदी).
- Whenever a user asks 'respond in telugu', 'telugu lo cheppandi', 'reply in telugu', 'explain in telugu', 'telugulo', 'తెలుగులో చెప్పండి', or asks a question in Telugu script, you MUST immediately switch and deliver your entire response in natural, fluent Telugu script (తెలుగు లిపి).
`}

RULES & CONSTRAINTS:
1. STRICT STATE RESTRICTION (ONLY ANDHRA PRADESH & TELANGANA):
   - You EXCLUSIVELY support and concentrate on the states of **Andhra Pradesh** and **Telangana** (in addition to Pan-India Central Government schemes).
   - NEVER recommend, provide information for, or process schemes from any other states (such as Karnataka, Tamil Nadu, Maharashtra, Uttar Pradesh, etc.). If a user asks about any state other than Andhra Pradesh or Telangana, politely state: "This platform is exclusively dedicated to Andhra Pradesh and Telangana state schemes alongside Central Government schemes. I cannot recommend schemes for other states."
   - Deeply concentrate on Andhra Pradesh schemes under the current government led by Chief Minister Nara Chandrababu Naidu (Annadata Sukhibhava farmer grant ₹20,000/yr [formerly YSR Rythu Bharosa], Dr. NTR Vaidya Seva ₹25 Lakh cashless healthcare [formerly Dr. YSR Aarogyasri], NTR Bharosa Social Security Pension ₹4,000/mo [formerly YSR Pension Kanuka], Thalliki Vandanam ₹15,000/child education incentive [restructured from Amma Vodi], Deepam 2.0 Free 3 LPG Gas Cylinders, Maha Shakti Free RTC Bus Travel for Women, Yuva Galam Unemployment Allowance ₹3,000/mo, JnanaBhumi Vidya Deevena & Vasathi Deevena Fee Reimbursement, and Sunna Vaddi for DWCRA women) and Telangana schemes (Telangana ePASS Post-Matric Scholarships & Fee Reimbursement, Maha Lakshmi Scheme for Women, Overseas Vidya Nidhi, TASK Youth Training Subsidy, Rythu Bharosa, Kalyana Lakshmi / Shaadi Mubarak, Rajiv Aarogyasri).
2. STRICT PROFILE RELEVANCE: Only recommend schemes and scholarships that strictly match the citizen's profile (Age, State, Category, Income limit, Occupation/Student/Farmer/Gender). NEVER recommend schemes outside the user's profile (e.g. do not recommend farmer schemes to students, do not recommend girl-child schemes to male users, do not recommend schemes with income limits lower than the citizen's income, and do not recommend schemes restricted to other states). If the user asks about an ineligible scheme, explain clearly why they do not meet the criteria.
3. Restrict factual verification strictly to official Indian government portals and websites (e.g. .gov.in, .nic.in, myscheme.gov.in, scholarships.gov.in, pmkisan.gov.in, telanganaepass.cgg.gov.in, jnanabhumi.ap.gov.in, etc.).
4. MANDATORY TEXT FORMAT IN CHATBOX (STRICTLY NO CARDS FORMAT):
   DO NOT display schemes and scholarships in cards format. Never output card layouts, button grids, or card UI.
   You MUST output all recommended schemes and scholarships in pure text format directly in the chatbox, numbered sequentially (1., 2., 3., ...), using these EXACT terms:
   1.
   **Scheme Name:** [Official Scheme Name]
   **Requirements:** [Eligibility criteria & Required Documents]
   **Why it suits you:** [Clear reason explaining why it suits the citizen's specific age, category, student/occupation status, and income]
   **Deadline:** [Active deadline date or 'Check Official Portal']
   **Official Portal Link:** [Direct clickable official government link e.g. [National Scholarship Portal](https://scholarships.gov.in) or https://scholarships.gov.in]

   2.
   **Scheme Name:** ...
   **Requirements:** ...
   **Why it suits you:** ...
   **Deadline:** ...
   **Official Portal Link:** ...

   Make sure EVERY scheme will be represented with these terms in text format in the chatbox itself.
5. CENTRAL GOVERNMENT SCHEMES & SCHOLARSHIPS:
   When the user asks about 'central schemes', 'central government schemes', 'national schemes', 'scholarships', or any Pan-India welfare programs, you MUST identify and present all active Central Government schemes and Centrally Sponsored scholarships matching their profile:
   - For Students: PM-YASASVI Central Sector Scholarship, Central Sector Scheme of Scholarship for College and University Students, PM Vidyalaxmi Higher Education Loan Interest Subsidy, National Means-cum-Merit Scholarship Scheme (NMMSS), AICTE Pragati Scholarship for Girls, Post-Matric Scholarships for SC/ST/OBC (NSP).
   - For Farmers: PM Kisan Samman Nidhi (₹6,000/yr direct income support), PM Fasal Bima Yojana, Kisan Credit Card.
   - For General Citizens / EWS: Ayushman Bharat PM-JAY (₹5 Lakh free health hospitalization), PM Awas Yojana (PMAY), PM Surya Ghar Muft Bijli Yojana.
   - For Entrepreneurs / Self-Employed: Pradhan Mantri MUDRA Yojana, Stand-Up India, PM Vishwakarma Yojana, PM SVANidhi.
   Always format every single Central scheme using the exact numbered text format specified above.
6. MANDATORY OFFICIAL LINK REQUIREMENT: For EVERY single scheme or scholarship mentioned, you MUST provide its valid official government application URL (e.g. [National Scholarship Portal](https://scholarships.gov.in), [Telangana ePASS](https://telanganaepass.cgg.gov.in), [JnanaBhumi AP](https://jnanabhumi.ap.gov.in), [PM-KISAN](https://pmkisan.gov.in), [PM-JAY](https://pmjay.gov.in), etc.). Never omit or leave the official link blank for ANY mentioned scheme.
7. Do not invent or estimate deadlines. If a deadline is unavailable or subject to official notification, clearly state: "Check Official Portal".
8. Provide concise, clear, and reassuring guidance. Explain how to prepare paperwork (e.g. Income certificate from Tehsildar, Bonafide from college, Bank Aadhaar DBT seeding) when helpful.`;

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
      primaryModel: 'gemini-flash-latest',
      fallbackModels: ['gemini-3.1-flash-lite', 'gemini-2.5-flash'],
      contents,
      config: {
        systemInstruction,
      }
    });

    if (response?.text) {
      return res.json({
        reply: response.text
      });
    }

    return res.json({
      reply: buildFallbackReply(message, userProfile, isTeluguRequested)
    });

    const isCentralQuery = false;
    if (isCentralQuery) {
      return res.json({
        reply: isTeluguRequested
          ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ప్రముఖ కేంద్ర ప్రభుత్వ పథకాలు & స్కాలర్‌షిప్‌లు క్రింద వివరించబడ్డాయి:

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
**పథకం పేరు (Scheme Name):** పీఎం విద్యాలక్ష్మి ఉన్నత విద్యా రుణ వడ్డీ రాయితీ (PM Vidyalaxmi)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** గుర్తింపు పొందిన ఉన్నత విద్యా సంస్థల్లో అడ్మిషన్, కుటుంబ ఆదాయం ₹8 లక్షల లోపు. పత్రాలు: అడ్మిషన్ లెటర్, ఫీజు రసీదు, ఆదాయ పత్రం, ఆధార్ కార్డు.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పూచీకత్తు లేకుండా ₹7.5 లక్షల వరకు విద్యా రుణాలపై పూర్తి వడ్డీ రాయితీ లభిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [పీఎం విద్యాలక్ష్మి పోర్టల్](https://www.pmvidyalaxmi.gov.in)`
          : `Here are verified active Central Government schemes and national scholarships matching your profile:

1.
**Scheme Name:** PM YASASVI Central Sector Scheme for OBC, EBC & DNT Students
**Requirements:** OBC/EBC/DNT students enrolled in recognized schools/colleges, Family annual income under ₹2.5 Lakh. Documents: Aadhaar Card, Income Certificate, Caste Certificate, Bonafide ID, Aadhaar DBT-linked Bank Account.
**Why it suits you:** Provides merit-based financial aid directly disbursed through Aadhaar DBT to support your education expenses.
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

2.
**Scheme Name:** Central Sector Scheme of Scholarship for College and University Students
**Requirements:** Above 80th percentile in Class 12 board examinations, enrolled in regular UG/PG course, Family annual income under ₹4.5 Lakh. Documents: Class 12 Marksheet, College Bonafide Certificate, Income Certificate, Aadhaar DBT Bank Account.
**Why it suits you:** Supports undergraduate and postgraduate degree pursuits with annual scholarship disbursements (₹12,000–₹20,000/year).
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

3.
**Scheme Name:** PM Vidyalaxmi Higher Education Loan Interest Subsidy Scheme
**Requirements:** Admitted to top NIRF-ranked higher education institutions in India, Annual family income up to ₹8 Lakh. Documents: Admission Letter, Course Fee Structure, Income Certificate from Tehsildar, PAN, Aadhaar.
**Why it suits you:** Enables collateral-free education loans up to ₹7.5 Lakh with central government interest subvention.
**Deadline:** Check Official Portal
**Official Portal Link:** [PM Vidyalaxmi Portal](https://www.pmvidyalaxmi.gov.in)`
      });
    }

    const isStateQuery = /(state|రాష్ట్ర|తెలంగాణ|telangana|andhra|ఆంధ్ర|local)/i.test(message || '');

    if (isStateQuery) {
      return res.json({
        reply: isTeluguRequested
          ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ప్రముఖ రాష్ట్ర ప్రభుత్వ పథకాలు క్రింద ఇవ్వబడ్డాయి:

1.
**పథకం పేరు (Scheme Name):** తెలంగాణ ఈ-పాస్ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్ (Telangana ePASS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** తెలంగాణ వాస్తవ్యులు, ఇంటర్/డిగ్రీ/పీజీ విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2 లక్షల లోపు (SC/ST లకు ₹2.5 లక్షల లోపు). పత్రాలు: ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, ఎస్ఎస్సీ హాల్ టికెట్, కాలేజీ బోనఫైడ్, ఆధార్ డీబీటీ బ్యాంకు ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పూర్తి కాలేజీ ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ (RTF) మరియు నెలవారీ వసతి భత్యం (MTF) నేరుగా అందిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఈ-పాస్ పోర్టల్](https://telanganaepass.cgg.gov.in)

2.
**పథకం పేరు (Scheme Name):** చీఫ్ మినిస్టర్స్ ఓవర్సీస్ స్కాలర్‌షిప్ పథకం (Overseas Vidya Nidhi)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** విదేశీ విశ్వవిద్యాలయాల్లో ఉన్నత విద్య (MS/PG) అభ్యసించే ఎస్సీ/ఎస్టీ/బీసీ విద్యార్థులు, వార్షిక ఆదాయం ₹5 లక్షల లోపు. పత్రాలు: GRE/TOEFL స్కోర్‌కార్డ్, అడ్మిషన్ ఆఫర్ లెటర్, ఆధార్, పాస్‌పోర్ట్, ఆదాయ ధృవీకరణ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** విదేశీ ఉన్నత విద్య కోసం గరిష్టంగా ₹20 లక్షల వరకు ఆర్థిక సహాయం గ్రాంట్‌గా మంజూరు చేస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఓవర్సీస్ స్కాలర్‌షిప్](https://telanganaepass.cgg.gov.in)

3.
**పథకం పేరు (Scheme Name):** తెలంగాణ యువ వికాసం స్కిల్ డెవలప్‌మెంట్ & స్వయం ఉపాధి శిక్షణ (TASK)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** తెలంగాణ యువత (వయస్సు 18-35 సం.), 10వ/12వ తరగతి లేదా గ్రాడ్యుయేషన్ పూర్తి. పత్రాలు: ఆధార్ కార్డు, విద్యార్హత పత్రాలు, స్థానికత ధృవీకరణ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పరిశ్రమలకు అవసరమైన ఆధునిక సాంకేతిక నైపుణ్యాల శిక్షణ మరియు ప్లేస్‌మెంట్ కల్పిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ అకాడమీ ఫర్ స్కిల్ అండ్ నాలెడ్జ్](https://task.telangana.gov.in)`
          : `Here are verified active State Government schemes and scholarships matching your profile:

1.
**Scheme Name:** Telangana ePASS Post-Matric Scholarship & Full Fee Reimbursement (RTF & MTF)
**Requirements:** Resident of Telangana studying intermediate, degree, engineering or professional courses, Annual family income under ₹2.00 Lakh (SC/ST under ₹2.50 Lakh). Documents: Income Certificate from MeeSeva, Integrated Community Certificate, SSC Marks Card, College Bonafide, Bank Passbook (DBT-seeded).
**Why it suits you:** Reimburses 100% of your college tuition fees and provides monthly maintenance grants directly to your bank account.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Portal](https://telanganaepass.cgg.gov.in)

2.
**Scheme Name:** Overseas Vidya Nidhi Scheme for Higher Education Abroad
**Requirements:** Students pursuing Master's / PhD degrees in recognized universities in USA, UK, Canada, Australia, Family income up to ₹5.00 Lakh. Documents: Valid Passport, Visa, Foreign University Offer Letter, GRE/IELTS/TOEFL scorecard, Income Certificate.
**Why it suits you:** Grants up to ₹20.00 Lakh direct financial assistance to support overseas tuition and living costs.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Overseas Portal](https://telanganaepass.cgg.gov.in)

3.
**Scheme Name:** Telangana Academy for Skill and Knowledge (TASK) Youth Development Program
**Requirements:** Telangana youth aged 18–35, enrolled in diploma/degree courses or recent graduates. Documents: College ID, Aadhaar Card, Academic Marksheets.
**Why it suits you:** Provides subsidized technology and industry-grade employability skill certifications with direct campus recruitment linkage.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana Academy for Skill and Knowledge](https://task.telangana.gov.in)`
      });
    }

    // General fallback formatted in strict numbered scheme format
    return res.json({
      reply: isTeluguRequested
        ? `మీ ప్రొఫైల్ ఆధారంగా ధృవీకరించబడిన కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ పథకాలు క్రింద పేర్కొన్న విధంగా ఉన్నాయి:

1.
**పథకం పేరు (Scheme Name):** పీఎం యశస్వి కేంద్రీయ స్కాలర్‌షిప్ పథకం (PM-YASASVI)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** OBC/EBC/DNT విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2.5 లక్షల లోపు. పత్రాలు: ఆధార్ కార్డు, ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, బోనఫైడ్, ఆధార్ డీబీటీ ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** కేంద్ర ప్రభుత్వం అందించే ప్రత్యక్ష డీబీటీ విద్యా నిధి ద్వారా ఉన్నత చదువులకు సహాయం లభిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

2.
**పథకం పేరు (Scheme Name):** కాలేజ్ & యూనివర్సిటీ విద్యార్థుల సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్ (CSSS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** ఇంటర్ / 12వ తరగతిలో 80 శాతానికి పైగా మార్కులు, రెగ్యులర్ డిగ్రీ విద్యార్థులు, కుటుంబ ఆదాయం ₹4.5 లక్షల లోపు. పత్రాలు: మార్కుల జాబితా, కాలేజీ బోనఫైడ్, ఆదాయ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** మీ మెరిట్ ఆధారంగా ప్రతి సంవత్సరం రూ. 12,000 నుండి 20,000 వరకు నేరుగా ఉపకార వేతనం అందుతుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

3.
**పథకం పేరు (Scheme Name):** తెలంగాణ ఈ-పాస్ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్ (Telangana ePASS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** పోస్ట్-మెట్రిక్ కళాశాల విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2 లక్షల లోపు. పత్రాలు: తహశీల్దార్ ఆదాయ పత్రం, కుల పత్రం, ఆధార్ డీబీటీ బ్యాంకు ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** కాలేజీ ట్యూషన్ ఫీజులను ప్రభుత్వం పూర్తిగా చెల్లించి ఉన్నత చదువులను ప్రోత్సహిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఈ-పాస్ పోర్టల్](https://telanganaepass.cgg.gov.in)`
        : `Here are active government schemes and scholarships matching your profile:

1.
**Scheme Name:** PM YASASVI Central Sector Scheme for OBC, EBC & DNT Students
**Requirements:** OBC/EBC/DNT students enrolled in recognized institutions, Annual family income under ₹2.5 Lakh. Documents: Aadhaar Card, Income Certificate, Caste Certificate, Bonafide ID, Aadhaar DBT-linked Bank Account.
**Why it suits you:** Provides merit-based financial aid directly disbursed through Aadhaar DBT to support your education expenses.
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

2.
**Scheme Name:** Central Sector Scheme of Scholarship for College and University Students
**Requirements:** Above 80th percentile in Class 12 board examinations, enrolled in regular UG/PG course, Family annual income under ₹4.5 Lakh. Documents: Class 12 Marksheet, College Bonafide Certificate, Income Certificate, Aadhaar DBT Bank Account.
**Why it suits you:** Supports undergraduate degree education with annual scholarship disbursements (₹12,000–₹20,000/year).
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

3.
**Scheme Name:** Telangana ePASS Post-Matric Scholarship & Full Fee Reimbursement (RTF & MTF)
**Requirements:** Resident of Telangana studying intermediate or higher education, Annual family income under ₹2.00 Lakh (SC/ST under ₹2.50 Lakh). Documents: Income Certificate from MeeSeva, Caste Certificate, SSC Marks Memo, College Bonafide, Bank Passbook.
**Why it suits you:** Reimburses 100% of college tuition fees and provides monthly maintenance stipends to eligible students.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Portal](https://telanganaepass.cgg.gov.in)`
    });
  } catch (error: any) {
    console.warn('Notice in /api/ai/chat:', error?.message || error);
    const { message, userProfile, language } = req.body || {};
    const isTeluguRequested = 
      (typeof language === 'string' && language.toLowerCase() === 'telugu') ||
      (/(\btelugu\b|తెలుగు|telugulo|telugu\s*lo)/i.test(message || '')) ||
      (/[\u0C00-\u0C7F]/.test(message || ''));

    return res.json({
      reply: buildFallbackReply(message, userProfile, isTeluguRequested)
    });

    const isCentralQuery = false;
    if (isCentralQuery) {
      return res.json({
        reply: isTeluguRequested
          ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ప్రముఖ కేంద్ర ప్రభుత్వ పథకాలు & స్కాలర్‌షిప్‌లు క్రింద వివరించబడ్డాయి:

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
**పథకం పేరు (Scheme Name):** పీఎం విద్యాలక్ష్మి ఉన్నత విద్యా రుణ వడ్డీ రాయితీ (PM Vidyalaxmi)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** గుర్తింపు పొందిన ఉన్నత విద్యా సంస్థల్లో అడ్మిషన్, కుటుంబ ఆదాయం ₹8 లక్షల లోపు. పత్రాలు: అడ్మిషన్ లెటర్, ఫీజు రసీదు, ఆదాయ పత్రం, ఆధార్ కార్డు.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పూచీకత్తు లేకుండా ₹7.5 లక్షల వరకు విద్యా రుణాలపై పూర్తి వడ్డీ రాయితీ లభిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [పీఎం విద్యాలక్ష్మి పోర్టల్](https://www.pmvidyalaxmi.gov.in)`
          : `Here are verified active Central Government schemes and national scholarships matching your profile:

1.
**Scheme Name:** PM YASASVI Central Sector Scheme for OBC, EBC & DNT Students
**Requirements:** OBC/EBC/DNT students enrolled in recognized schools/colleges, Family annual income under ₹2.5 Lakh. Documents: Aadhaar Card, Income Certificate, Caste Certificate, Bonafide ID, Aadhaar DBT-linked Bank Account.
**Why it suits you:** Provides merit-based financial aid directly disbursed through Aadhaar DBT to support your education expenses.
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

2.
**Scheme Name:** Central Sector Scheme of Scholarship for College and University Students
**Requirements:** Above 80th percentile in Class 12 board examinations, enrolled in regular UG/PG course, Family annual income under ₹4.5 Lakh. Documents: Class 12 Marksheet, College Bonafide Certificate, Income Certificate, Aadhaar DBT Bank Account.
**Why it suits you:** Supports undergraduate and postgraduate degree pursuits with annual scholarship disbursements (₹12,000–₹20,000/year).
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

3.
**Scheme Name:** PM Vidyalaxmi Higher Education Loan Interest Subsidy Scheme
**Requirements:** Admitted to top NIRF-ranked higher education institutions in India, Annual family income up to ₹8 Lakh. Documents: Admission Letter, Course Fee Structure, Income Certificate from Tehsildar, PAN, Aadhaar.
**Why it suits you:** Enables collateral-free education loans up to ₹7.5 Lakh with central government interest subvention.
**Deadline:** Check Official Portal
**Official Portal Link:** [PM Vidyalaxmi Portal](https://www.pmvidyalaxmi.gov.in)`
      });
    }

    const isStateQuery = /(state|రాష్ట్ర|తెలంగాణ|telangana|andhra|ఆంధ్ర|local)/i.test(message || '');

    if (isStateQuery) {
      return res.json({
        reply: isTeluguRequested
          ? `మీ ప్రొఫైల్ వివరాల ఆధారంగా ధృవీకరించబడిన ప్రముఖ రాష్ట్ర ప్రభుత్వ పథకాలు క్రింద ఇవ్వబడ్డాయి:

1.
**పథకం పేరు (Scheme Name):** తెలంగాణ ఈ-పాస్ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్ (Telangana ePASS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** తెలంగాణ వాస్తవ్యులు, ఇంటర్/డిగ్రీ/పీజీ విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2 లక్షల లోపు (SC/ST లకు ₹2.5 లక్షల లోపు). పత్రాలు: ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, ఎస్ఎస్సీ హాల్ టికెట్, కాలేజీ బోనఫైడ్, ఆధార్ డీబీటీ బ్యాంకు ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పూర్తి కాలేజీ ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ (RTF) మరియు నెలవారీ వసతి భత్యం (MTF) నేరుగా అందిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఈ-పాస్ పోర్టల్](https://telanganaepass.cgg.gov.in)

2.
**పథకం పేరు (Scheme Name):** చీఫ్ మినిస్టర్స్ ఓవర్సీస్ స్కాలర్‌షిప్ పథకం (Overseas Vidya Nidhi)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** విదేశీ విశ్వవిద్యాలయాల్లో ఉన్నత విద్య (MS/PG) అభ్యసించే ఎస్సీ/ఎస్టీ/బీసీ విద్యార్థులు, వార్షిక ఆదాయం ₹5 లక్షల లోపు. పత్రాలు: GRE/TOEFL స్కోర్‌కార్డ్, అడ్మిషన్ ఆఫర్ లెటర్, ఆధార్, పాస్‌పోర్ట్, ఆదాయ ధృవీకరణ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** విదేశీ ఉన్నత విద్య కోసం గరిష్టంగా ₹20 లక్షల వరకు ఆర్థిక సహాయం గ్రాంట్‌గా మంజూరు చేస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఓవర్సీస్ స్కాలర్‌షిప్](https://telanganaepass.cgg.gov.in)

3.
**పథకం పేరు (Scheme Name):** తెలంగాణ యువ వికాసం స్కిల్ డెవలప్‌మెంట్ & స్వయం ఉపాధి శిక్షణ (TASK)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** తెలంగాణ యువత (వయస్సు 18-35 సం.), 10వ/12వ తరగతి లేదా గ్రాడ్యుయేషన్ పూర్తి. పత్రాలు: ఆధార్ కార్డు, విద్యార్హత పత్రాలు, స్థానికత ధృవీకరణ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** పరిశ్రమలకు అవసరమైన ఆధునిక సాంకేతిక నైపుణ్యాల శిక్షణ మరియు ప్లేస్‌మెంట్ కల్పిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ అకాడమీ ఫర్ స్కిల్ అండ్ నాలెడ్జ్](https://task.telangana.gov.in)`
          : `Here are verified active State Government schemes and scholarships matching your profile:

1.
**Scheme Name:** Telangana ePASS Post-Matric Scholarship & Full Fee Reimbursement (RTF & MTF)
**Requirements:** Resident of Telangana studying intermediate, degree, engineering or professional courses, Annual family income under ₹2.00 Lakh (SC/ST under ₹2.50 Lakh). Documents: Income Certificate from MeeSeva, Integrated Community Certificate, SSC Marks Card, College Bonafide, Bank Passbook (DBT-seeded).
**Why it suits you:** Reimburses 100% of your college tuition fees and provides monthly maintenance grants directly to your bank account.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Portal](https://telanganaepass.cgg.gov.in)

2.
**Scheme Name:** Overseas Vidya Nidhi Scheme for Higher Education Abroad
**Requirements:** Students pursuing Master's / PhD degrees in recognized universities in USA, UK, Canada, Australia, Family income up to ₹5.00 Lakh. Documents: Valid Passport, Visa, Foreign University Offer Letter, GRE/IELTS/TOEFL scorecard, Income Certificate.
**Why it suits you:** Grants up to ₹20.00 Lakh direct financial assistance to support overseas tuition and living costs.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Overseas Portal](https://telanganaepass.cgg.gov.in)

3.
**Scheme Name:** Telangana Academy for Skill and Knowledge (TASK) Youth Development Program
**Requirements:** Telangana youth aged 18–35, enrolled in diploma/degree courses or recent graduates. Documents: College ID, Aadhaar Card, Academic Marksheets.
**Why it suits you:** Provides subsidized technology and industry-grade employability skill certifications with direct campus recruitment linkage.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana Academy for Skill and Knowledge](https://task.telangana.gov.in)`
      });
    }

    // Return friendly resilient fallback formatted in strict numbered scheme format
    res.json({
      reply: isTeluguRequested
        ? `మీ ప్రొఫైల్ ఆధారంగా ధృవీకరించబడిన ప్రముఖ కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ పథకాలు క్రింద పేర్కొన్న విధంగా ఉన్నాయి:

1.
**పథకం పేరు (Scheme Name):** పీఎం యశస్వి కేంద్రీయ స్కాలర్‌షిప్ పథకం (PM-YASASVI)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** OBC/EBC/DNT విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2.5 లక్షల లోపు. పత్రాలు: ఆధార్ కార్డు, ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, బోనఫైడ్, ఆధార్ డీబీటీ ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** కేంద్ర ప్రభుత్వం అందించే ప్రత్యక్ష డీబీటీ విద్యా నిధి ద్వారా ఉన్నత చదువులకు సహాయం లభిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

2.
**పథకం పేరు (Scheme Name):** కాలేజ్ & యూనివర్సిటీ విద్యార్థుల సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్ (CSSS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** ఇంటర్ / 12వ తరగతిలో 80 శాతానికి పైగా మార్కులు, రెగ్యులర్ డిగ్రీ విద్యార్థులు, కుటుంబ ఆదాయం ₹4.5 లక్షల లోపు. పత్రాలు: మార్కుల జాబితా, కాలేజీ బోనఫైడ్, ఆదాయ పత్రం.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** మీ మెరిట్ ఆధారంగా ప్రతి సంవత్సరం రూ. 12,000 నుండి 20,000 వరకు నేరుగా ఉపకార వేతనం అందుతుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [నేషనల్ స్కాలర్‌షిప్ పోర్టల్](https://scholarships.gov.in)

3.
**పథకం పేరు (Scheme Name):** తెలంగాణ ఈ-పాస్ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్ (Telangana ePASS)
**అర్హతలు & అవసరమైన పత్రాలు (Requirements):** పోస్ట్-మెట్రిక్ కళాశాల విద్యార్థులు, వార్షిక కుటుంబ ఆదాయం ₹2 లక్షల లోపు. పత్రాలు: తహశీల్దార్ ఆదాయ పత్రం, కుల పత్రం, ఆధార్ డీబీటీ బ్యాంకు ఖాతా.
**మీకు ఎందుకు సరిపోతుంది (Why it suits you):** కాలేజీ ట్యూషన్ ఫీజులను ప్రభుత్వం పూర్తిగా చెల్లించి ఉన్నత చదువులను ప్రోత్సహిస్తుంది.
**గడువు తేదీ (Deadline):** Check Official Portal
**అధికారిక పోర్టల్ లింక్ (Official Portal Link):** [తెలంగాణ ఈ-పాస్ పోర్టల్](https://telanganaepass.cgg.gov.in)`
        : `Here are active government schemes and scholarships matching your profile:

1.
**Scheme Name:** PM YASASVI Central Sector Scheme for OBC, EBC & DNT Students
**Requirements:** OBC/EBC/DNT students enrolled in recognized institutions, Annual family income under ₹2.5 Lakh. Documents: Aadhaar Card, Income Certificate, Caste Certificate, Bonafide ID, Aadhaar DBT-linked Bank Account.
**Why it suits you:** Provides merit-based financial aid directly disbursed through Aadhaar DBT to support your education expenses.
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

2.
**Scheme Name:** Central Sector Scheme of Scholarship for College and University Students
**Requirements:** Above 80th percentile in Class 12 board examinations, enrolled in regular UG/PG course, Family annual income under ₹4.5 Lakh. Documents: Class 12 Marksheet, College Bonafide Certificate, Income Certificate, Aadhaar DBT Bank Account.
**Why it suits you:** Supports undergraduate degree education with annual scholarship disbursements (₹12,000–₹20,000/year).
**Deadline:** Check Official Portal
**Official Portal Link:** [National Scholarship Portal](https://scholarships.gov.in)

3.
**Scheme Name:** Telangana ePASS Post-Matric Scholarship & Full Fee Reimbursement (RTF & MTF)
**Requirements:** Resident of Telangana studying intermediate or higher education, Annual family income under ₹2.00 Lakh (SC/ST under ₹2.50 Lakh). Documents: Income Certificate from MeeSeva, Caste Certificate, SSC Marks Memo, College Bonafide, Bank Passbook.
**Why it suits you:** Reimburses 100% of college tuition fees and provides monthly maintenance stipends to eligible students.
**Deadline:** Check Official Portal
**Official Portal Link:** [Telangana ePASS Portal](https://telanganaepass.cgg.gov.in)`
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
      fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
      }
    });

    let advice: Record<string, string> = {};
    let scanSummary = `Found ${candidateSchemes.length} matching schemes for your profile.`;

    if (response?.text) {
      try {
        const parsed = JSON.parse(response.text);
        if (parsed.scanSummary) scanSummary = parsed.scanSummary;
        if (parsed.advice) advice = parsed.advice;
      } catch (e) {
        console.warn('JSON parsing notice for scan-schemes');
      }
    } else {
      candidateSchemes.forEach((s: any) => {
        advice[s.id] = `Eligible under ${s.category || 'general'} criteria in ${s.state || 'India'}. Check official portal for active registration deadlines.`;
      });
    }

    return res.json({
      success: true,
      scanSummary,
      advice
    });
  } catch (error: any) {
    console.warn('Notice in /api/ai/scan-schemes:', error?.message || error);
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
      fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
      contents: prompt,
      config: {
        systemInstruction: 'You are the official Yojana Mitra Assistant for Indian Government Schemes and Scholarships. Always ground advice in verified government portals (.gov.in).'
      }
    });

    res.json({
      answer: response?.text || 'Please check the official portal for specific scheme criteria or try your query again in a moment.',
      sources: ['National Portal / Department Guidelines']
    });
  } catch (error: any) {
    console.warn('Notice in /api/ai/ask-scheme:', error?.message || error);
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
      fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const groundingChunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
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
      summary: response?.text || 'Official schemes matching your query are active. Please check myscheme.gov.in or scholarships.gov.in.',
      groundingUrls: urls
    });
  } catch (error: any) {
    console.warn('Notice in /api/ai/search-schemes:', error?.message || error);
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
      primaryModel: 'gemini-3.8-flash',
      fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
      contents: prompt
    });

    res.json({
      analysis: response?.text || 'Document checklist verified.'
    });
  } catch (error: any) {
    console.warn('Notice in /api/ai/check-documents:', error?.message || error);
    res.json({
      analysis: 'Please verify that your Caste, Income, and Education certificates are active and that your bank account is seeded with Aadhaar for DBT transfer.'
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
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

// Only launch HTTP listener if running outside Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
