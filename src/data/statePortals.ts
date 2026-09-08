export interface OfficialPortalInfo {
  name: string;
  url: string;
  domain: string;
  category: string;
  description: string;
  targetSchemes?: string[];
}

export const STATE_OFFICIAL_PORTALS: Record<string, OfficialPortalInfo[]> = {
  Telangana: [
    {
      name: 'Telangana ePASS Portal',
      url: 'https://telanganaepass.cgg.gov.in',
      domain: 'telanganaepass.cgg.gov.in',
      category: 'Scholarships & Higher Education',
      description: 'Official portal for Post-Matric & Pre-Matric Scholarships, Fee Reimbursement (RTF), Maintenance Fees (MTF), and Overseas Vidya Nidhi.',
      targetSchemes: ['epass', 'post-matric', 'fee reimbursement', 'overseas', 'vidya nidhi', 'scholarship', 'ambedkar overseas', 'jyotiba phule']
    },
    {
      name: 'Government of Telangana Portal',
      url: 'https://telangana.gov.in',
      domain: 'telangana.gov.in',
      category: 'State Flagship Welfare',
      description: 'Official Government of Telangana state portal for Maha Lakshmi guarantee, Praja Palana welfare schemes, and civil services.',
      targetSchemes: ['mahalaxmi', 'maha lakshmi', 'praja palana', 'gas cylinder', 'rtc', 'bus travel', 'cheyutha']
    },
    {
      name: 'MeeSeva Telangana',
      url: 'https://meeseva.telangana.gov.in',
      domain: 'meeseva.telangana.gov.in',
      category: 'Citizen Certificates & Application Delivery',
      description: 'Official portal for Integrated Caste Certificates, Income Certificates, Residence Certificates, and state welfare paperwork.',
      targetSchemes: ['meeseva', 'caste certificate', 'income certificate', 'residence proof', 'kalyana lakshmi', 'shaadi mubarak']
    },
    {
      name: 'TGSRTC Official Portal',
      url: 'https://tgsrtc.telangana.gov.in',
      domain: 'tgsrtc.telangana.gov.in',
      category: 'Public Transport & Women Free Travel',
      description: 'Official transport authority for Maha Lakshmi Zero-Fare bus tickets for women and girl residents.',
      targetSchemes: ['tgsrtc', 'maha lakshmi bus', 'zero ticket', 'bus pass']
    },
    {
      name: 'TASK (Telangana Academy for Skill and Knowledge)',
      url: 'https://task.telangana.gov.in',
      domain: 'task.telangana.gov.in',
      category: 'Student Skill Training & Placement',
      description: 'Official skilling and finishing school ecosystem subsidized by the Department of ITE&C, Government of Telangana.',
      targetSchemes: ['task', 'skill', 'training', 'placement', 'internship', 'it finishing']
    },
    {
      name: 'Dharani Telangana Portal',
      url: 'https://dharani.telangana.gov.in',
      domain: 'dharani.telangana.gov.in',
      category: 'Agriculture & Land Records',
      description: 'Integrated land records management system verifying Rythu Bandhu and agricultural welfare eligibility.',
      targetSchemes: ['dharani', 'rythu bandhu', 'rythu bharosa', 'rythu bima']
    }
  ],
  Maharashtra: [
    {
      name: 'MahaDBT Official Portal',
      url: 'https://mahadbt.maharashtra.gov.in',
      domain: 'mahadbt.maharashtra.gov.in',
      category: 'Direct Benefit Transfer & Scholarships',
      description: 'Aaple Sarkar DBT portal for Post-Matric scholarships, freeships, and fee waivers across SC, ST, OBC, VJNT, and SEBC students.',
      targetSchemes: ['mahadbt', 'post-matric', 'scholarship', 'rajarshi shahu', 'dr ambedkar', 'swadhaar']
    },
    {
      name: 'Mukhyamantri Majhi Ladki Bahin Portal',
      url: 'https://ladkibahin.maharashtra.gov.in',
      domain: 'ladkibahin.maharashtra.gov.in',
      category: 'Women Welfare',
      description: 'Official government portal for the Mukhyamantri Majhi Ladki Bahin Scheme providing ₹1,500/month financial aid.',
      targetSchemes: ['ladki bahin', 'majhi ladki bahin', 'women grant']
    },
    {
      name: 'Aaple Sarkar Citizen Portal',
      url: 'https://aaplesarkar.mahaonline.gov.in',
      domain: 'aaplesarkar.mahaonline.gov.in',
      category: 'Revenue & Welfare Certificates',
      description: 'Official Maharashtra portal for Income, Domicile, Non-Creamy Layer, and Caste Certificates.',
      targetSchemes: ['aaple sarkar', 'income certificate', 'domicile', 'caste validation']
    },
    {
      name: 'Krishi Maharashtra (Namo Shetkari Portal)',
      url: 'https://krishi.maharashtra.gov.in',
      domain: 'krishi.maharashtra.gov.in',
      category: 'Agriculture & Farmer Support',
      description: 'Official portal for Namo Shetkari Mahasanman Nidhi Yojana providing ₹6,000/year supplementary aid.',
      targetSchemes: ['namo shetkari', 'krishi', 'shetkari', 'crop insurance']
    },
    {
      name: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
      url: 'https://www.jeevandayee.gov.in',
      domain: 'jeevandayee.gov.in',
      category: 'Health & Medical Cover',
      description: 'Official cashless medical treatment portal covering up to ₹5,00,000 per family per year.',
      targetSchemes: ['jan arogya', 'mjpjay', 'jeevandayee', 'health cover']
    }
  ],
  'Uttar Pradesh': [
    {
      name: 'UP Scholarship & Fee Reimbursement Portal',
      url: 'https://scholarship.up.gov.in',
      domain: 'scholarship.up.gov.in',
      category: 'Scholarships & Student Welfare',
      description: 'Official portal for UP Pre-Matric and Post-Matric scholarships, fee reimbursement, and Dashmottar schemes.',
      targetSchemes: ['up scholarship', 'dashmottar', 'pre-matric', 'post-matric', 'fee reimbursement']
    },
    {
      name: 'Mukhyamantri Abhyudaya Yojana Portal',
      url: 'https://abhyuday.up.gov.in',
      domain: 'abhyuday.up.gov.in',
      category: 'Free Coaching & Academic Mentorship',
      description: 'Official portal for free coaching, study material, and tablets for UPSC, UPPSC, JEE, and NEET aspirants.',
      targetSchemes: ['abhyuday', 'abhyudaya', 'free coaching', 'tablet scheme']
    },
    {
      name: 'SSPY UP Social Security Pension Portal',
      url: 'https://sspy-up.gov.in',
      domain: 'sspy-up.gov.in',
      category: 'Pensions & Social Welfare',
      description: 'Official portal for Old Age, Widow, and Divyangjan pensions in Uttar Pradesh.',
      targetSchemes: ['sspy', 'vridha pension', 'widow pension', 'divyang pension']
    },
    {
      name: 'eSathi Uttar Pradesh',
      url: 'https://esathi.up.gov.in',
      domain: 'esathi.up.gov.in',
      category: 'Revenue & Certificate Portal',
      description: 'Official single-window portal for Income, Caste, Domicile, and Birth Certificates in UP.',
      targetSchemes: ['esathi', 'income certificate', 'caste certificate', 'niwas praman patra']
    }
  ],
  Karnataka: [
    {
      name: 'Karnataka State Scholarship Portal (SSP)',
      url: 'https://ssp.postmatric.karnataka.gov.in',
      domain: 'ssp.postmatric.karnataka.gov.in',
      category: 'Post-Matric Scholarships',
      description: 'Official unified portal for Post-Matric scholarships, fee concessions, and hostel allowances across all departments.',
      targetSchemes: ['ssp', 'post-matric', 'scholarship', 'fee concession', 'vidyasiri']
    },
    {
      name: 'Seva Sindhu Karnataka',
      url: 'https://sevasindhu.karnataka.gov.in',
      domain: 'sevasindhu.karnataka.gov.in',
      category: 'Flagship Welfare Guarantees',
      description: 'Official portal for Gruha Lakshmi (₹2,000/month), Yuva Nidhi unemployment stipend, Gruha Jyothi, and Shakti free bus travel.',
      targetSchemes: ['seva sindhu', 'gruha lakshmi', 'yuva nidhi', 'gruha jyothi', 'shakti']
    },
    {
      name: 'Karnataka One Portal',
      url: 'https://karnatakaone.gov.in',
      domain: 'karnatakaone.gov.in',
      category: 'Citizen Services & Revenue Certificates',
      description: 'Official single-window citizen portal for Nadakacheri caste, income, and residence certificates.',
      targetSchemes: ['karnataka one', 'nadakacheri', 'income certificate', 'caste certificate']
    }
  ],
  'Tamil Nadu': [
    {
      name: 'Pudhumai Penn / Moovalur Ramamirtham Portal',
      url: 'https://penkalvi.tn.gov.in',
      domain: 'penkalvi.tn.gov.in',
      category: 'Higher Education for Girls',
      description: 'Official Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme providing ₹1,000/month to girl students.',
      targetSchemes: ['pudhumai penn', 'moovalur ramamirtham', 'penkalvi', 'tamil pudhalvan']
    },
    {
      name: 'CM Comprehensive Health Insurance (CMCHISTN)',
      url: 'https://www.cmchistn.com',
      domain: 'cmchistn.com',
      category: 'Health Insurance',
      description: 'Chief Minister’s Comprehensive Health Insurance Scheme providing ₹5,00,000 cashless medical coverage.',
      targetSchemes: ['cmchistn', 'health insurance', 'cashless hospital']
    },
    {
      name: 'TN e-Sevai Portal',
      url: 'https://www.tnesevai.tn.gov.in',
      domain: 'tnesevai.tn.gov.in',
      category: 'Government Welfare Services',
      description: 'Official single-window portal for Community, Income, First Graduate, and Nativity certificates.',
      targetSchemes: ['e-sevai', 'first graduate', 'nativity', 'community certificate']
    }
  ],
  Bihar: [
    {
      name: 'PMS Online Bihar',
      url: 'https://pmsonline.bih.nic.in',
      domain: 'pmsonline.bih.nic.in',
      category: 'Post-Matric Scholarships',
      description: 'Official Bihar Post-Matric Scholarship portal for SC, ST, BC, and EBC students pursuing intermediate, degree, and professional courses.',
      targetSchemes: ['pmsonline', 'post-matric', 'bihar scholarship', 'bc ebc scholarship']
    },
    {
      name: '7 Nishchay (Bihar Student Credit Card)',
      url: 'https://www.7nishchay-yuvaupmission.bihar.gov.in',
      domain: '7nishchay-yuvaupmission.bihar.gov.in',
      category: 'Higher Education Loans & Youth Allowance',
      description: 'Official portal for Bihar Student Credit Card (up to ₹4,00,000 education loan at subsidized interest) and Swayam Sahayata Bhatta.',
      targetSchemes: ['student credit card', '7 nishchay', 'swayam sahayata bhatta', 'kushal yuva program']
    },
    {
      name: 'Medhasoft Bihar Portal',
      url: 'https://medhasoft.bih.nic.in',
      domain: 'medhasoft.bih.nic.in',
      category: 'Girl Child & Merit Welfare',
      description: 'Official DBT portal for Mukhyamantri Kanya Utthan Yojana (Graduation & Intermediate incentive awards) and Medhavriti.',
      targetSchemes: ['medhasoft', 'kanya utthan', 'medhavriti', 'protsahan yojana']
    },
    {
      name: 'Mukhyamantri Udyami Yojana Portal',
      url: 'https://udyami.bihar.gov.in',
      domain: 'udyami.bihar.gov.in',
      category: 'Enterprise & Entrepreneurship Subsidy',
      description: 'Official portal offering ₹10,00,000 project funding with 50% grant for SC, ST, EBC, Women, and Youth entrepreneurs.',
      targetSchemes: ['udyami', 'udyami yojana', 'enterprise loan', 'startup bihar']
    }
  ],
  'Andhra Pradesh': [
    {
      name: 'JnanaBhumi AP Portal',
      url: 'https://jnanabhumi.ap.gov.in',
      domain: 'jnanabhumi.ap.gov.in',
      category: 'Post-Matric Scholarships & Fee Support',
      description: 'Official AP portal for Jagananna Vidya Deevena (100% fee reimbursement) and Vasathi Deevena (hostel & food support).',
      targetSchemes: ['jnanabhumi', 'vidya deevena', 'vasathi deevena', 'post-matric scholarship']
    },
    {
      name: 'AP Navasakam Citizen Portal',
      url: 'https://navasakam2.apcfss.in',
      domain: 'navasakam2.apcfss.in',
      category: 'Direct Benefit Transfer Services',
      description: 'Official Government of Andhra Pradesh single-window portal for social audit, smart cards, and DBT entitlement cards.',
      targetSchemes: ['navasakam', 'cheyutha', 'aasara', 'ebc nestham']
    },
    {
      name: 'AP MeeSeva Portal',
      url: 'https://meeseva.ap.gov.in',
      domain: 'meeseva.ap.gov.in',
      category: 'Certificates & Citizen Paperwork',
      description: 'Official portal for Integrated Caste, Income, and Residence certificates in Andhra Pradesh.',
      targetSchemes: ['meeseva', 'caste certificate', 'income certificate']
    }
  ],
  Delhi: [
    {
      name: 'Delhi SC/ST/OBC/Minority Welfare Portal',
      url: 'https://scstwelfare.delhigovt.nic.in',
      domain: 'scstwelfare.delhigovt.nic.in',
      category: 'Coaching & Scholarships',
      description: 'Official portal for Jai Bhim Mukhyamantri Pratibha Vikas Yojana providing free coaching and ₹2,500/month stipend.',
      targetSchemes: ['jai bhim', 'pratibha vikas', 'free coaching', 'delhi scholarship']
    },
    {
      name: 'e-District Delhi Portal',
      url: 'https://edistrict.delhigovt.nic.in',
      domain: 'edistrict.delhigovt.nic.in',
      category: 'Single Window Government Services',
      description: 'Official portal for online applications, domicile verification, income certificates, and state welfare schemes in Delhi.',
      targetSchemes: ['edistrict', 'domicile', 'income certificate', 'delhi welfare']
    }
  ],
  'West Bengal': [
    {
      name: 'SVMCM Higher Education Portal',
      url: 'https://svmcm.wbhed.gov.in',
      domain: 'svmcm.wbhed.gov.in',
      category: 'Merit-cum-Means Scholarships',
      description: 'Official Swami Vivekananda Merit-cum-Means (SVMCM) scholarship portal providing ₹12,000 to ₹60,000/year to higher education students.',
      targetSchemes: ['svmcm', 'swami vivekananda', 'merit cum means', 'higher education']
    },
    {
      name: 'Oasis Scholarship Portal',
      url: 'https://oasis.gov.in',
      domain: 'oasis.gov.in',
      category: 'SC/ST/OBC Welfare',
      description: 'Official Government of West Bengal Backward Classes Welfare portal for pre/post-matric scholarships.',
      targetSchemes: ['oasis', 'backward classes', 'sc st obc scholarship']
    }
  ],
  Gujarat: [
    {
      name: 'Mukhyamantri Yuva Swavalamban Yojana (MYSY)',
      url: 'https://mysy.guj.nic.in',
      domain: 'mysy.guj.nic.in',
      category: 'Higher Education Tuition Support',
      description: 'Official Gujarat portal offering up to 50% tuition reimbursement and hostel assistance to higher education students.',
      targetSchemes: ['mysy', 'yuva swavalamban', 'tuition assistance', 'gujarat scholarship']
    },
    {
      name: 'Digital Gujarat Citizen Portal',
      url: 'https://www.digitalgujarat.gov.in',
      domain: 'digitalgujarat.gov.in',
      category: 'Unified Welfare Services',
      description: 'Official single-window portal for Post-Matric scholarships, freeships, and government certificate issuance.',
      targetSchemes: ['digital gujarat', 'scholarship', 'income certificate', 'caste certificate']
    }
  ],
  'Madhya Pradesh': [
    {
      name: 'CM Ladli Bahna Yojana Portal',
      url: 'https://cmladlibahna.mp.gov.in',
      domain: 'cmladlibahna.mp.gov.in',
      category: 'Women Financial Assistance',
      description: 'Official portal for the Mukhyamantri Ladli Bahna Yojana providing ₹1,250/month direct cash assistance.',
      targetSchemes: ['ladli bahna', 'women grant', 'cmladlibahna']
    },
    {
      name: 'MP Scholarship Portal 2.0',
      url: 'https://scholarshipportal.mp.nic.in',
      domain: 'scholarshipportal.mp.nic.in',
      category: 'Higher Education Scholarships',
      description: 'Official portal for Post-Matric, Gaon Ki Beti, Pratibha Kiran, and Medhavi Vidyarthi Yojana in MP.',
      targetSchemes: ['mp scholarship', 'medhavi vidyarthi', 'gaon ki beti', 'pratibha kiran']
    }
  ],
  Rajasthan: [
    {
      name: 'SJMS Rajasthan Portal (Uttar Matric)',
      url: 'https://sje.rajasthan.gov.in',
      domain: 'sje.rajasthan.gov.in',
      category: 'Scholarships & Social Justice',
      description: 'Official portal of the Social Justice & Empowerment Department for Uttar Matric Scholarships and Anuprati coaching.',
      targetSchemes: ['uttar matric', 'anuprati coaching', 'sje', 'social justice scholarship']
    },
    {
      name: 'Jan Aadhaar Rajasthan',
      url: 'https://janaadhaar.rajasthan.gov.in',
      domain: 'janaadhaar.rajasthan.gov.in',
      category: 'Citizen Identification & DBT Delivery',
      description: 'Single-window government database verifying eligibility and direct financial disbursement across all state schemes.',
      targetSchemes: ['jan aadhaar', 'direct benefit', 'rajasthan entitlement']
    }
  ],
  Kerala: [
    {
      name: 'DCE Scholarship Portal Kerala',
      url: 'https://dcescholarship.kerala.gov.in',
      domain: 'dcescholarship.kerala.gov.in',
      category: 'Collegiate Education Scholarships',
      description: 'Official Directorate of Collegiate Education portal for Post-Matric, Suvarna Jubilee, and State Merit Scholarships.',
      targetSchemes: ['dce', 'collegiate scholarship', 'suvarna jubilee', 'state merit scholarship']
    },
    {
      name: 'e-Grantz 3.0 Kerala',
      url: 'https://egrantz.kerala.gov.in',
      domain: 'egrantz.kerala.gov.in',
      category: 'Direct Educational Assistance',
      description: 'Unified online portal for educational assistance to SC, ST, and OEC students in Kerala.',
      targetSchemes: ['egrantz', 'educational assistance', 'sc st oec']
    }
  ],
  Odisha: [
    {
      name: 'Odisha State Scholarship Portal',
      url: 'https://scholarship.odisha.gov.in',
      domain: 'scholarship.odisha.gov.in',
      category: 'Unified State Scholarships',
      description: 'Integrated single-window portal providing pre-matric, post-matric, technical, and professional scholarships.',
      targetSchemes: ['odisha scholarship', 'prerana', 'post-matric', 'technical scholarship']
    },
    {
      name: 'KALIA Portal Odisha',
      url: 'https://kalia.odisha.gov.in',
      domain: 'kalia.odisha.gov.in',
      category: 'Farmer & Livelihood Support',
      description: 'Official Krushak Assistance for Livelihood and Income Augmentation portal.',
      targetSchemes: ['kalia', 'farmer support', 'krushak', 'livelihood']
    }
  ]
};

// National Umbrella Portals applicable across states
export const NATIONAL_UMBRELLA_PORTALS: OfficialPortalInfo[] = [
  {
    name: 'National Scholarship Portal (NSP)',
    url: 'https://scholarships.gov.in',
    domain: 'scholarships.gov.in',
    category: 'Central & State Scholarship Registry',
    description: 'The single apex national portal for Central Sector, Centrally Sponsored, and State Level scholarships across India.',
    targetSchemes: ['nsp', 'national scholarship', 'central sector', 'ishaan uday', 'pmss', 'yasasvi']
  },
  {
    name: 'myScheme National Portal',
    url: 'https://www.myscheme.gov.in',
    domain: 'myscheme.gov.in',
    category: 'Government of India Discovery Engine',
    description: 'Official national e-Governance portal to check eligibility and access online applications for 700+ Central and State schemes.',
    targetSchemes: ['myscheme', 'government portal', 'all schemes']
  }
];

/**
 * Finds all relevant official government portals for a specific state and optional response text
 */
export function getOfficialPortalsForState(stateName: string, responseText?: string): OfficialPortalInfo[] {
  const normalizedState = Object.keys(STATE_OFFICIAL_PORTALS).find(
    s => s.toLowerCase() === stateName.toLowerCase()
  );

  const stateList = normalizedState ? STATE_OFFICIAL_PORTALS[normalizedState] : [];
  
  if (!responseText || !responseText.trim()) {
    return [...stateList, ...NATIONAL_UMBRELLA_PORTALS];
  }

  const lowerText = responseText.toLowerCase();

  // If text is provided, sort by relevance to the mentioned schemes in the text
  const matched = stateList.filter(portal => {
    if (lowerText.includes(portal.name.toLowerCase()) || lowerText.includes(portal.domain.toLowerCase())) {
      return true;
    }
    return portal.targetSchemes?.some(tag => lowerText.includes(tag.toLowerCase()));
  });

  const unmatched = stateList.filter(portal => !matched.includes(portal));

  // Return matched first, followed by remaining state portals, then national portals
  return [...matched, ...unmatched, ...NATIONAL_UMBRELLA_PORTALS];
}
