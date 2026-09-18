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
      description: 'Integrated land records management system verifying Rythu Bandhu, Rythu Bharosa, and agricultural welfare eligibility.',
      targetSchemes: ['dharani', 'rythu bandhu', 'rythu bharosa', 'rythu bima']
    }
  ],
  'Andhra Pradesh': [
    {
      name: 'JnanaBhumi AP Portal',
      url: 'https://jnanabhumi.ap.gov.in',
      domain: 'jnanabhumi.ap.gov.in',
      category: 'Post-Matric Scholarships & Education Support',
      description: 'Official Government of AP portal for Post-Matric Fee Reimbursement, Vasathi Deevena, Thalliki Vandanam, and Overseas Vidya Grants.',
      targetSchemes: ['jnanabhumi', 'vidya deevena', 'vasathi deevena', 'thalliki vandanam', 'post-matric scholarship', 'videshi vidya']
    },
    {
      name: 'AP Navasakam / Spandana Citizen Portal',
      url: 'https://navasakam2.apcfss.in',
      domain: 'navasakam2.apcfss.in',
      category: 'Direct Benefit Transfer Services',
      description: 'Official Government of Andhra Pradesh portal for citizen welfare audit, Annadata Sukhibhava, NTR Bharosa, Deepam 2.0, and DBT cards.',
      targetSchemes: ['navasakam', 'annadata sukhibhava', 'ntr bharosa', 'deepam scheme', 'sunna vaddi', 'yuva galam']
    },
    {
      name: 'AP MeeSeva Portal',
      url: 'https://meeseva.ap.gov.in',
      domain: 'meeseva.ap.gov.in',
      category: 'Certificates & Citizen Paperwork',
      description: 'Official portal for Integrated Caste, Income, and Residence certificates in Andhra Pradesh.',
      targetSchemes: ['meeseva', 'caste certificate', 'income certificate', 'residence proof']
    },
    {
      name: 'Dr. NTR Vaidya Seva Trust',
      url: 'https://aarogyasri.ap.gov.in',
      domain: 'aarogyasri.ap.gov.in',
      category: 'Healthcare & Medical Cover',
      description: 'Official cashless medical treatment portal covering comprehensive health procedures up to ₹25,00,000 across AP and network cities.',
      targetSchemes: ['ntr vaidya seva', 'aarogyasri', 'health cover', 'cashless hospital']
    }
  ]
};

export const NATIONAL_UMBRELLA_PORTALS: OfficialPortalInfo[] = [
  {
    name: 'National Scholarship Portal (NSP)',
    url: 'https://scholarships.gov.in',
    domain: 'scholarships.gov.in',
    category: 'Central & State Scholarships',
    description: 'Centralized Indian government gateway for Central Sector Schemes, CSS, and UGC/AICTE scholarship applications.',
    targetSchemes: ['nsp', 'scholarship', 'central sector', 'ishaan uday', 'pragati', 'saksham']
  },
  {
    name: 'myScheme Official Portal',
    url: 'https://www.myscheme.gov.in',
    domain: 'myscheme.gov.in',
    category: 'National Scheme Discovery & Eligibility Engine',
    description: 'National digital platform operated by MeitY and NeGD to verify citizen eligibility across Central & State ministries.',
    targetSchemes: ['myscheme', 'schemes', 'central', 'welfare', 'all india']
  },
  {
    name: 'JanSamarth Portal',
    url: 'https://www.jansamarth.in',
    domain: 'jansamarth.in',
    category: 'Credit-Linked Government Schemes',
    description: 'Official digital platform linking credit-backed government subsidy schemes including PMEGP, Stand-Up India, and Mudra.',
    targetSchemes: ['jansamarth', 'pmegp', 'mudra', 'loan', 'credit', 'startup subsidy']
  }
];

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
