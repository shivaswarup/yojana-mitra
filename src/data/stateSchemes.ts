import { Scheme } from '../types';

export const STATE_SCHEMES: Scheme[] = [
  // ===================== TELANGANA =====================
  {
    id: 'telangana-epass-scholarship',
    name: 'Telangana ePASS Post-Matric Scholarship & Fee Reimbursement',
    slug: 'telangana-epass-scholarship',
    shortDescription: 'Sanction of full tuition fee reimbursement and monthly maintenance charges (MTF) for Post-Matric students in Telangana.',
    description: 'The Electronic Payment and Application System of Scholarships (ePASS) is the flagship welfare initiative of the Government of Telangana providing complete tuition fee reimbursement (RTF) and maintenance charges (MTF) to SC, ST, BC, EBC, Minority, and PwD students pursuing post-matric intermediate, polytechnic, graduate, postgraduate, and professional degrees.',
    category: 'Scholarships',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Scheduled Castes Development & Backward Classes Welfare Department, Govt of Telangana',
    financialBenefitAmount: '100% Tuition Fee Reimbursement + ₹1,400 to ₹1,800/month maintenance allowance',
    benefits: [
      '100% College tuition fee reimbursement credited directly to the college account',
      'Monthly maintenance charges (MTF) up to ₹18,000/year deposited into student’s Aadhaar-seeded bank account',
      'Coverage across Engineering, Medicine, MBA, MCA, Degree, Polytechnic, and Intermediate programs'
    ],
    eligibility: [
      'Must be a permanent resident/domicile of Telangana State',
      'Belonging to SC / ST / BC / EBC / Minority / PwD categories',
      'Pursuing Post-Matric regular course recognized by State Universities / Boards (min 75% attendance)',
      'Parental annual income limit: ₹2,00,000 for SC/ST, and ₹1,50,000 (Rural) / ₹2,00,000 (Urban) for BC/EBC/Minorities'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 32,
      states: ['Telangana'],
      categories: ['SC', 'ST', 'OBC', 'EWS', 'Minority', 'General'],
      maxIncome: 250000,
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card of student and parents',
      'Telangana Integrated Caste Certificate (MeeSeva signed)',
      'Latest Income Certificate issued by MeeSeva / Tehsildar (valid for academic year)',
      'SSC (10th) Hall Ticket Number & Marks Memo',
      'Admission allotment letter & College Bonafide Certificate',
      'Aadhaar-seeded Bank Passbook in student’s name'
    ],
    applicationProcess: [
      'Register on Telangana ePASS portal at telanganaepass.cgg.gov.in',
      'Select "Post-Matric Scholarship" and enter SSC Memo details to auto-verify credentials',
      'Enter College code, course, admission details, and upload Caste & Income certificates',
      'Submit hard copy of application with original documents to College Scholarship Clerk',
      'Institute verifies credentials online and forwards to District Welfare Officer'
    ],
    deadline: '9 September 2026 (Closing in 3 Days)',
    deadlineDate: '2026-09-09',
    isDeadlineApproaching: true,
    officialWebsite: 'https://telanganaepass.cgg.gov.in',
    officialSource: 'Government of Telangana, Department of Welfare',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'scholarship', 'fee reimbursement', 'epass', 'college', 'student']
  },
  {
    id: 'telangana-mahalaxmi',
    name: 'Telangana Maha Lakshmi Scheme for Women & Girls',
    slug: 'telangana-mahalaxmi',
    shortDescription: 'Free travel for girls, women of all age groups, and transgender persons in state-run RTC buses, alongside financial assistance.',
    description: 'The Maha Lakshmi Scheme is a landmark welfare guarantee by the Government of Telangana ensuring free public transport for women across all Palle Velugu and Express buses operated by TGSRTC, with subsidized domestic LPG cylinders and targeted monthly financial support.',
    category: 'Women',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Transport Department & Women Development and Child Welfare, Govt of Telangana',
    financialBenefitAmount: '100% Zero-fare travel across Telangana + ₹500 Subsidized LPG + Monthly cash grant',
    benefits: [
      'Zero-fare bus travel in TGSRTC Palle Velugu, Express, City Ordinary, and Metro Express buses within Telangana state',
      'Direct monthly financial empowerment grant for eligible women heads of families',
      'Subsidized domestic LPG cylinders at ₹500 under Praja Palana guarantee'
    ],
    eligibility: [
      'Resident girl or woman citizen of Telangana (all age groups)',
      'Transgender persons domiciled in Telangana State',
      'Valid domicile proof / residence proof within Telangana'
    ],
    eligibilityRules: {
      minAge: 0,
      maxAge: 100,
      states: ['Telangana'],
      genders: ['female', 'other']
    },
    requiredDocuments: [
      'Aadhaar Card or voter ID showing Telangana address (for zero-ticket bus travel)',
      'Praja Palana Application acknowledgment (for cash & cylinder benefits)',
      'Ration Card / Food Security Card (FSC)'
    ],
    applicationProcess: [
      'For bus travel: Show Aadhaar Card or Telangana domicile photo ID to bus conductor for Zero Ticket',
      'For financial & gas cylinder benefits: Apply through Praja Palana application centres or official portal'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://telangana.gov.in',
    officialSource: 'Government of Telangana, Transport & Civil Supplies Dept',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'women', 'free bus', 'mahalaxmi', 'tgsrtc']
  },

  // ===================== MAHARASHTRA =====================
  {
    id: 'maharashtra-ladki-bahin',
    name: 'Maharashtra Mukhyamantri Majhi Ladki Bahin Yojana',
    slug: 'maharashtra-ladki-bahin',
    shortDescription: 'Direct monthly financial support of ₹1,500 (₹18,000/year) into bank accounts of women aged 21-65 years in Maharashtra.',
    description: 'Mukhyamantri Majhi Ladki Bahin Yojana is a flagship women empowerment scheme by the Government of Maharashtra providing direct cash transfers of ₹1,500 every month directly to married, widowed, divorced, deserted, and unmarried adult women from low-income families.',
    category: 'Women',
    state: 'Maharashtra',
    governmentLevel: 'State',
    department: 'Department of Women & Child Development, Government of Maharashtra',
    financialBenefitAmount: '₹1,500 per month (₹18,000 per year) DBT',
    benefits: [
      'Direct Benefit Transfer (DBT) of ₹1,500 every month into Aadhaar-linked bank account',
      'Total financial assistance of ₹18,000 annually',
      'Direct economic independence, nutrition, and self-sustenance support'
    ],
    eligibility: [
      'Female permanent resident of Maharashtra State',
      'Age between 21 and 65 years',
      'Total annual family income must not exceed ₹2.5 Lakhs per annum',
      'Applicant should hold an Aadhaar-linked bank account and yellow or orange ration card',
      'Married, widowed, divorced, deserted, and single/unmarried adult women are all eligible'
    ],
    eligibilityRules: {
      minAge: 21,
      maxAge: 65,
      states: ['Maharashtra'],
      genders: ['female'],
      maxIncome: 250000,
      maritalStatuses: ['Single', 'Married', 'Widowed', 'Divorced']
    },
    requiredDocuments: [
      'Aadhaar Card (Aadhaar Seeded bank account)',
      'Maharashtra Domicile Certificate or 15-year old Ration Card/Voter ID/School Leaving Certificate',
      'Income Certificate (under ₹2.5 Lakhs) or Yellow/Orange Ration Card',
      'Bank Account Passbook showing IFSC code',
      'Undertaking (Hamipatra) on Nari Shakti Doot app or portal'
    ],
    applicationProcess: [
      'Download Nari Shakti Doot mobile app or visit ladkibahin.maharashtra.gov.in',
      'Register mobile number and complete e-KYC using Aadhaar',
      'Upload Ration Card, Domicile proof, and Bank Passbook details',
      'Verification conducted by Anganwadi workers, Ward committees, and Tehsildar offices'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://ladkibahin.maharashtra.gov.in',
    officialSource: 'Women & Child Development Dept, Govt of Maharashtra',
    lastUpdated: 'August 2026',
    tags: ['maharashtra', 'state scheme', 'women', 'ladki bahin', 'dbt', 'cash grant']
  },
  {
    id: 'maharashtra-namo-shetkari',
    name: 'Maharashtra Namo Shetkari Mahasanman Nidhi Yojana',
    slug: 'maharashtra-namo-shetkari',
    shortDescription: 'State investment grant of ₹6,000 per year in 3 equal installments to all eligible landholding farmer families in Maharashtra.',
    description: 'The Namo Shetkari Mahasanman Nidhi Yojana is an agricultural income support initiative by the Government of Maharashtra supplementing the central PM-KISAN scheme with an additional ₹6,000 per year, bringing the total farmer direct cash benefit to ₹12,000 per year.',
    category: 'Agriculture',
    state: 'Maharashtra',
    governmentLevel: 'State',
    department: 'Department of Agriculture, Government of Maharashtra',
    financialBenefitAmount: '₹6,000 per year (Total ₹12,000/yr combined with PM-KISAN)',
    benefits: [
      'Direct cash transfer of ₹2,000 each in three 4-monthly cycles',
      '100% DBT credit directly to farmer’s Aadhaar-enabled bank account',
      'Supports purchasing seeds, bio-fertilizers, pesticides, and modern drip micro-irrigation'
    ],
    eligibility: [
      'Must be a resident farmer of Maharashtra',
      'Must be registered and verified beneficiary of PM-KISAN Samman Nidhi',
      'Must possess cultivable land with clear 7/12 (Saat Bara) and 8A land revenue extract in Maharashtra',
      'Landholding linked with Aadhaar and bank account'
    ],
    eligibilityRules: {
      minAge: 18,
      states: ['Maharashtra'],
      requiresFarmer: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Land Title Extract 7/12 (Saat Bara) and 8A',
      'PM-KISAN Registration ID',
      'Aadhaar seeded bank account passbook',
      'Mobile number linked to Aadhaar'
    ],
    applicationProcess: [
      'Farmers already registered under PM-KISAN in Maharashtra are auto-enrolled',
      'New farmers register on Mahadbt farmer portal or PM-KISAN portal',
      'Verify land records and e-KYC on the Maharashtra Krishi portal at krishi.maharashtra.gov.in',
      'Disbursements credited in synchronized cycles with PM-KISAN installments'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://krishi.maharashtra.gov.in',
    officialSource: 'Department of Agriculture, Government of Maharashtra',
    lastUpdated: 'August 2026',
    tags: ['maharashtra', 'state scheme', 'farmer', 'namo shetkari', 'agriculture', 'dbt']
  },
  {
    id: 'mahadbt-post-matric',
    name: 'MahaDBT Post-Matric Scholarship Scheme for Maharashtra Students',
    slug: 'mahadbt-post-matric-scholarship',
    shortDescription: '100% tuition & examination fee waiver and living maintenance allowance for SC/ST/OBC/VJNT/EWS students in Maharashtra.',
    description: 'MahaDBT is the centralized portal of the Government of Maharashtra delivering Post-Matric scholarships, freeships, and hostel allowances across higher education, technical institutes, medical colleges, and universities for students domiciled in Maharashtra.',
    category: 'Scholarships',
    state: 'Maharashtra',
    governmentLevel: 'State',
    department: 'Social Justice & Special Assistance Department, Govt of Maharashtra',
    financialBenefitAmount: '100% Tuition & Exam Fee Reimbursement + up to ₹1,200/month maintenance',
    benefits: [
      '100% Course tuition fee and exam fee waiver paid directly to recognized institutions',
      'Monthly maintenance allowance for day scholars and hostellers',
      'Swadhar Yojana additional allowance up to ₹60,000/year for SC students not getting govt hostel admission'
    ],
    eligibility: [
      'Resident and domiciled in Maharashtra State',
      'Passed SSC (10th) or HSC (12th) and pursuing regular post-matric course in Maharashtra',
      'Belonging to SC, ST, OBC, VJNT, SBC, or EWS categories',
      'Family income criteria: Up to ₹2.5 Lakhs for SC/ST, and up to ₹1.5 Lakhs (Scholarship) / ₹8 Lakhs (Freeship) for OBC/EWS'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 32,
      states: ['Maharashtra'],
      categories: ['SC', 'ST', 'OBC', 'EWS'],
      maxIncome: 250000,
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Maharashtra Domicile Certificate',
      'Caste Certificate and Caste Validity Certificate (issued by competent Maharashtra authority)',
      'Income Certificate issued by Tehsildar',
      'Aadhaar Card and Aadhaar seeded Bank Account',
      'Previous year Marksheet and College Bonafide / Admission Fee Receipt'
    ],
    applicationProcess: [
      'Visit mahadbt.maharashtra.gov.in and create citizen login with Aadhaar e-KYC',
      'Select Department (Social Justice / Tribal Welfare / Higher Education) and relevant scholarship scheme',
      'Upload caste, income, and domicile certificates and select admitted college course',
      'College scrutiny officer validates documents and forwards for government sanction'
    ],
    deadline: '15 November 2026',
    deadlineDate: '2026-11-15',
    isDeadlineApproaching: false,
    officialWebsite: 'https://mahadbt.maharashtra.gov.in',
    officialSource: 'Government of Maharashtra, Social Justice Department',
    lastUpdated: 'August 2026',
    tags: ['maharashtra', 'state scheme', 'scholarship', 'mahadbt', 'higher education', 'student']
  },
  {
    id: 'maharashtra-mjpjay',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
    slug: 'maharashtra-mjpjay',
    shortDescription: 'Cashless health insurance coverage up to ₹5 Lakhs per family per year across 1,300+ medical and surgical procedures.',
    description: 'MJPJAY is the flagship universal healthcare insurance program of Maharashtra offering cashless hospital coverage of ₹5 Lakhs per family annually in both government and private empanelled hospitals, integrated with PMJAY.',
    category: 'Health',
    state: 'Maharashtra',
    governmentLevel: 'State',
    department: 'Public Health Department, Government of Maharashtra',
    financialBenefitAmount: '₹5,00,000 cashless hospitalization coverage per family/year',
    benefits: [
      'Cashless in-patient treatment up to ₹5,00,000 per family per year',
      'Covers 1,356 medical and surgical procedures across 30 specialized fields',
      'Free diagnostics, medicines, ICU care, food, and 10 days post-discharge consultations'
    ],
    eligibility: [
      'Permanent resident family of Maharashtra',
      'Families holding Yellow, Orange (income under ₹1 Lakh), or White Ration Cards',
      'Farmers from 14 distressed agrarian districts holding 7/12 land extract',
      'All resident families covered under universal coverage guidelines'
    ],
    eligibilityRules: {
      minAge: 0,
      maxAge: 120,
      states: ['Maharashtra']
    },
    requiredDocuments: [
      'Valid Maharashtra Ration Card (Yellow, Orange, or White)',
      'Aadhaar Card of patient and family head',
      'Voter ID / Domicile Certificate'
    ],
    applicationProcess: [
      'Visit any empanelled Network Hospital (Government or Private) in Maharashtra',
      'Meet the Arogyamitra stationed at the hospital helpdesk with Ration card and Aadhaar',
      'Arogyamitra generates cashless pre-authorization with the State Health Assurance Society',
      'Treatment and surgery completed with zero out-of-pocket payment'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.jeevandayee.gov.in',
    officialSource: 'State Health Assurance Society, Govt of Maharashtra',
    lastUpdated: 'August 2026',
    tags: ['maharashtra', 'state scheme', 'health', 'cashless', 'mjpjay', 'medical treatment']
  },

  // ===================== UTTAR PRADESH =====================
  {
    id: 'up-post-matric-scholarship',
    name: 'Uttar Pradesh Post-Matric Scholarship & Fee Reimbursement System',
    slug: 'up-post-matric-scholarship',
    shortDescription: '100% course fee reimbursement and monthly maintenance stipend for General, OBC, SC, ST & Minority students in UP.',
    description: 'Flagship scholarship scheme implemented by the Social Welfare, Backward Classes Welfare, and Minority Welfare Departments of Uttar Pradesh, providing complete reimbursement of non-refundable tuition fees and living stipends for students pursuing intermediate, diploma, UG, PG, and professional courses.',
    category: 'Scholarships',
    state: 'Uttar Pradesh',
    governmentLevel: 'State',
    department: 'Social Welfare & Backward Classes Welfare Department, Government of Uttar Pradesh',
    financialBenefitAmount: '100% Tuition Fee Refund (up to ₹50,000+) + Monthly maintenance stipend',
    benefits: [
      'Full refund of university/college non-refundable fees directly to institution or student account',
      'Monthly scholarship allowance up to ₹1,200/month for day scholars and hostellers',
      'Direct Benefit Transfer directly via PFMS into Aadhaar-linked bank accounts'
    ],
    eligibility: [
      'Must be a permanent resident of Uttar Pradesh',
      'Belonging to General, OBC, SC, ST, or Minority communities',
      'Enrolled in recognized intermediate (11th-12th), ITI, Polytechnic, UG, PG, B.Tech, MBBS, or B.Ed courses in UP',
      'Annual parental family income must NOT exceed ₹2.5 Lakhs for SC/ST and ₹2.0 Lakhs for General/OBC/Minority'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 35,
      states: ['Uttar Pradesh'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'],
      maxIncome: 250000,
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'UP Domicile / Niwas Praman Patra',
      'Caste Certificate (Jati Praman Patra) verifiable on edistrict.up.gov.in',
      'Income Certificate (Aay Praman Patra) issued by Tehsildar',
      'Aadhaar Card with mobile number linked',
      'Class 10th and 12th Marksheets & College Fee Receipt',
      'Bank Account Passbook (Aadhaar NPCI mapped)'
    ],
    applicationProcess: [
      'Register online on UP Scholarship Portal at scholarship.up.gov.in',
      'Complete Aadhaar DigiLocker authentication and enter admission registration number',
      'Fill fee amount, bank details, and submit online draft',
      'Print final application and submit hard copies with certificates to college nodal officer',
      'District Welfare Committee reviews and sanctions payment via PFMS'
    ],
    deadline: '20 November 2026',
    deadlineDate: '2026-11-20',
    isDeadlineApproaching: false,
    officialWebsite: 'https://scholarship.up.gov.in',
    officialSource: 'Government of Uttar Pradesh, Social Welfare Department',
    lastUpdated: 'August 2026',
    tags: ['uttar pradesh', 'up', 'state scheme', 'scholarship', 'fee reimbursement', 'student']
  },
  {
    id: 'up-vridhavastha-pension',
    name: 'Uttar Pradesh Mukhyamantri Vridhavastha Pension (Old Age Pension)',
    slug: 'up-vridhavastha-pension',
    shortDescription: 'Monthly social security pension of ₹1,000 (₹12,000/year) for elderly senior citizens aged 60+ in Uttar Pradesh.',
    description: 'The Old Age Pension Scheme of Uttar Pradesh provides guaranteed social security and dignified living financial aid to destitute, economically backward senior citizens aged 60 years and above through direct monthly bank transfers.',
    category: 'Pension',
    state: 'Uttar Pradesh',
    governmentLevel: 'State',
    department: 'Social Welfare Department, Government of Uttar Pradesh',
    financialBenefitAmount: '₹1,000 per month (₹12,000 per year) DBT',
    benefits: [
      '₹1,000 per month deposited quarterly into Aadhaar-seeded bank accounts',
      'Reliable financial independence for healthcare and subsistence for elderly citizens',
      'Simple online registration and door-to-door verification by Gram Panchayat / Lekhpal'
    ],
    eligibility: [
      'Resident of Uttar Pradesh aged 60 years or older',
      'Annual income limit: Up to ₹46,080/year in rural areas and ₹56,460/year in urban areas',
      'Applicant must not be receiving any other government pension or retirement benefit'
    ],
    eligibilityRules: {
      minAge: 60,
      maxAge: 120,
      states: ['Uttar Pradesh'],
      maxIncome: 56460,
      requiresSeniorCitizen: true
    },
    requiredDocuments: [
      'Aadhaar Card for age and identity proof',
      'UP Domicile / Residence Proof',
      'Income Certificate issued by Tehsildar',
      'Aadhaar-seeded Bank Account Passbook',
      'Passport size photograph'
    ],
    applicationProcess: [
      'Apply online on SSPY portal at sspy-up.gov.in under Old Age Pension',
      'Enter Aadhaar number and verify via OTP',
      'Upload income certificate and bank details',
      'Field verification conducted by BDO (Rural) or SDM (Urban) within 30 days',
      'Approved pensions disbursed directly via DBT PFMS'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://sspy-up.gov.in',
    officialSource: 'Social Welfare Department, Government of Uttar Pradesh',
    lastUpdated: 'August 2026',
    tags: ['uttar pradesh', 'up', 'state scheme', 'pension', 'senior citizen', 'old age']
  },
  {
    id: 'up-abhyudaya',
    name: 'Uttar Pradesh Mukhyamantri Abhyudaya Yojana',
    slug: 'up-abhyudaya-coaching',
    shortDescription: 'Free competitive examination coaching (UPSC, UPPSC, JEE, NEET, NDA, CDS) along with tablets and digital study resources.',
    description: 'An educational welfare scheme by the Government of Uttar Pradesh offering high-quality offline coaching classes and virtual mentorship by IAS, IPS, and subject experts to economically weaker students in every division of UP for competitive examinations.',
    category: 'Education',
    state: 'Uttar Pradesh',
    governmentLevel: 'State',
    department: 'Social Welfare Department, Government of Uttar Pradesh',
    financialBenefitAmount: '100% Free Premier Coaching + Free Tablet / Study Kit + Library Access',
    benefits: [
      'Free offline classes conducted at divisional headquarters by civil servants and top educators',
      'Free tablets distributed to meritorious enrolled students for digital learning',
      'Free test series, digital content library, and mock interview preparations'
    ],
    eligibility: [
      'Domicile resident of Uttar Pradesh',
      'Preparing for competitive examinations (UPSC CSE, UPPSC, JEE Main/Advanced, NEET, CDS, NDA, SSC)',
      'Family income preference given to low-income and disadvantaged students'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 32,
      states: ['Uttar Pradesh'],
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'UP Domicile Certificate',
      'Educational Marksheets (10th/12th/Graduation)',
      'Income Certificate (if seeking tablet assistance)'
    ],
    applicationProcess: [
      'Register on the official portal at abhyuday.up.gov.in',
      'Select examination category and preferred division/district center',
      'Appear in the online entrance selection examination conducted by the Department',
      'Merit-listed candidates invited for classroom onboarding'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://abhyuday.up.gov.in',
    officialSource: 'Social Welfare Department, Govt of Uttar Pradesh',
    lastUpdated: 'August 2026',
    tags: ['uttar pradesh', 'up', 'state scheme', 'education', 'coaching', 'free tablet', 'upsc', 'neet']
  },

  // ===================== KARNATAKA =====================
  {
    id: 'karnataka-yuva-nidhi',
    name: 'Karnataka Yuva Nidhi Scheme for Unemployed Graduates & Diploma Holders',
    slug: 'karnataka-yuva-nidhi',
    shortDescription: 'Monthly unemployment financial stipend of ₹3,000 for degree holders and ₹1,500 for diploma holders for up to 2 years.',
    description: 'The Yuva Nidhi Scheme is one of the five guarantee schemes of the Government of Karnataka, providing direct monthly unemployment assistance to youth who graduated in Karnataka and have remained unemployed for at least 6 months, alongside free skill training.',
    category: 'Employment',
    state: 'Karnataka',
    governmentLevel: 'State',
    department: 'Department of Skill Development, Entrepreneurship and Livelihood, Govt of Karnataka',
    financialBenefitAmount: '₹3,000/month for Degree Graduates & ₹1,500/month for Diploma Holders',
    benefits: [
      'Direct bank credit of ₹3,000 per month for degree holders (BE, B.Sc, B.Com, BA, etc.)',
      'Direct bank credit of ₹1,500 per month for diploma holders',
      'Financial support valid for up to 2 years or until employment is secured',
      'Free skill training certifications and job placement drives by the Karnataka Skill Mission'
    ],
    eligibility: [
      'Domicile of Karnataka who studied in Karnataka for minimum 6 years',
      'Completed Degree or Diploma during recent academic years and unemployed for at least 6 months',
      'Not admitted in higher full-time education programs during the benefit period',
      'Not employed in private or government sector (no PF/ESI deduction)'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 32,
      states: ['Karnataka'],
      minEducation: ['Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Degree / Diploma Certificate and Marksheet (convocation or provisional)',
      'Karnataka Domicile / Study Certificate showing 6 years study in Karnataka',
      'Aadhaar-linked Bank Account Passbook',
      'Self-declaration of unemployment'
    ],
    applicationProcess: [
      'Apply online through the Seva Sindhu portal at sevasindhu.karnataka.gov.in or Karnataka One centers',
      'Provide Aadhaar and university degree register number to auto-verify credentials',
      'Submit self-declaration of unemployment status',
      'Approved monthly allowance deposited directly into bank account via DBT'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://sevasindhu.karnataka.gov.in',
    officialSource: 'Government of Karnataka, Skill Development Dept',
    lastUpdated: 'August 2026',
    tags: ['karnataka', 'state scheme', 'employment', 'yuva nidhi', 'unemployment', 'graduates', 'dbt']
  },
  {
    id: 'karnataka-gruha-lakshmi',
    name: 'Karnataka Gruha Lakshmi Scheme for Women Heads of Household',
    slug: 'karnataka-gruha-lakshmi',
    shortDescription: 'Direct financial assistance of ₹2,000 per month into bank accounts of female heads of families in Karnataka.',
    description: 'Gruha Lakshmi is a landmark welfare guarantee providing ₹2,000 per month to the woman designated as head of the family in the Antyodaya, BPL, and APL ration cards in Karnataka, fostering female financial autonomy and household well-being.',
    category: 'Women',
    state: 'Karnataka',
    governmentLevel: 'State',
    department: 'Department of Women & Child Development, Government of Karnataka',
    financialBenefitAmount: '₹2,000 per month (₹24,000 per year) DBT',
    benefits: [
      'Direct Benefit Transfer of ₹2,000 every month directly into the woman head’s bank account',
      'Guaranteed annual support of ₹24,000',
      'Assistance for family nutrition, children’s schooling, and domestic expenses'
    ],
    eligibility: [
      'Woman named as head of the household in Antyodaya, BPL, or APL card issued by Govt of Karnataka',
      'Resident of Karnataka',
      'Applicant or husband must not be paying income tax or GST'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 90,
      states: ['Karnataka'],
      genders: ['female']
    },
    requiredDocuments: [
      'Aadhaar Card of the woman head and spouse',
      'Ration Card (APL/BPL/Antyodaya) showing woman as head',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    applicationProcess: [
      'Register at Grama One, Karnataka One, Bangalore One, or Bapuji Seva Kendra centers',
      'Provide Ration card number and Aadhaar OTP verification',
      'Bank account mapping verified via NPCI',
      'Direct monthly benefit credit starts immediately following approval'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://sevasindhu.karnataka.gov.in',
    officialSource: 'Women & Child Development, Govt of Karnataka',
    lastUpdated: 'August 2026',
    tags: ['karnataka', 'state scheme', 'women', 'gruha lakshmi', 'dbt', 'cash grant']
  },

  // ===================== TAMIL NADU =====================
  {
    id: 'tamilnadu-pudhumai-penn',
    name: 'Tamil Nadu Pudhumai Penn Higher Education Assurance Scheme',
    slug: 'tamilnadu-pudhumai-penn',
    shortDescription: 'Monthly financial assistance of ₹1,000 deposited into bank accounts of girl students who studied classes 6-12 in govt schools.',
    description: 'Under the Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn), the Government of Tamil Nadu transfers ₹1,000 per month directly into the bank accounts of female students pursuing undergraduate degrees, diplomas, or ITI courses until completion.',
    category: 'Scholarships',
    state: 'Tamil Nadu',
    governmentLevel: 'State',
    department: 'Social Welfare & Women Empowerment Department, Government of Tamil Nadu',
    financialBenefitAmount: '₹1,000 per month (₹12,000 per year) till course completion',
    benefits: [
      'Monthly financial grant of ₹1,000 deposited every month during academic course duration',
      'Deters female dropout rates and boosts female gross enrollment ratio in higher education',
      'Applicable in arts, science, engineering, medical, law, polytechnic, and ITI institutions'
    ],
    eligibility: [
      'Female student domiciled in Tamil Nadu',
      'Must have studied Classes 6 to 12 in Government Schools of Tamil Nadu',
      'Pursuing full-time Undergraduate degree, Diploma, or ITI course in Tamil Nadu'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 26,
      states: ['Tamil Nadu'],
      genders: ['female'],
      requiresStudent: true,
      minEducation: ['12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'EMIS Number and Government School Study Certificates (Classes 6-12)',
      'Class 10th and 12th Marksheets',
      'College Admission Fee receipt & Bonafide Certificate',
      'Aadhaar-linked Bank Account Passbook'
    ],
    applicationProcess: [
      'Apply online on the official portal at penkalvi.tn.gov.in',
      'Enter EMIS ID to auto-populate government school details',
      'College nodal officer verifies registration and forwards to Social Welfare Officer',
      'Monthly stipend deposited directly via DBT'
    ],
    deadline: '31 October 2026',
    deadlineDate: '2026-10-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://penkalvi.tn.gov.in',
    officialSource: 'Social Welfare Department, Govt of Tamil Nadu',
    lastUpdated: 'August 2026',
    tags: ['tamil nadu', 'state scheme', 'women', 'scholarship', 'pudhumai penn', 'higher education']
  },
  {
    id: 'tamilnadu-cmchis',
    name: 'Chief Minister’s Comprehensive Health Insurance Scheme (CMCHIS) Tamil Nadu',
    slug: 'tamilnadu-cmchis',
    shortDescription: 'Cashless hospital treatment up to ₹5 Lakhs per family per year across 1,090 empanelled hospitals in Tamil Nadu.',
    description: 'CMCHIS is a state-funded universal health insurance initiative by the Government of Tamil Nadu providing comprehensive cashless hospitalization and surgical procedures up to ₹5 Lakhs annually for families earning less than ₹1,20,000/year.',
    category: 'Health',
    state: 'Tamil Nadu',
    governmentLevel: 'State',
    department: 'Health and Family Welfare Department, Government of Tamil Nadu',
    financialBenefitAmount: '₹5,00,000 cashless medical & surgical treatment per family/year',
    benefits: [
      'Cashless coverage up to ₹5,00,000 per family per year for 1,090 surgical & medical procedures',
      'Includes specialized treatments like organ transplants, cardiology, oncology, and diagnostic tests',
      'Free medications and follow-up care for 5 days post-discharge'
    ],
    eligibility: [
      'Permanent resident family of Tamil Nadu',
      'Annual family income less than ₹1,20,000 per annum',
      'Holding valid Smart Family Ration Card in Tamil Nadu'
    ],
    eligibilityRules: {
      minAge: 0,
      maxAge: 120,
      states: ['Tamil Nadu'],
      maxIncome: 120000
    },
    requiredDocuments: [
      'Tamil Nadu Smart Family Ration Card',
      'Aadhaar Card of all family members',
      'Income Certificate issued by Revenue Authority (VAO/Tehsildar)'
    ],
    applicationProcess: [
      'Visit District Collectorate or empanelled Government Hospital CMCHIS Kiosk',
      'Submit Smart Card and biometric enrollment for URN (Unique Registration Number)',
      'Receive CMCHIS Health Smart Card for instant cashless admission'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.cmchistn.com',
    officialSource: 'Health & Family Welfare Dept, Government of Tamil Nadu',
    lastUpdated: 'August 2026',
    tags: ['tamil nadu', 'state scheme', 'health', 'cmchis', 'insurance', 'cashless treatment']
  },

  // ===================== DELHI =====================
  {
    id: 'delhi-jai-bhim-pratibha',
    name: 'Delhi Jai Bhim Mukhyamantri Pratibha Vikas Yojana',
    slug: 'delhi-jai-bhim-pratibha',
    shortDescription: 'Free competitive coaching (UPSC, IIT-JEE, NEET, Banking, CLAT) + ₹2,500/month stipend for SC/ST/OBC/EWS students in Delhi.',
    description: 'An education initiative by the Government of NCT of Delhi covering full coaching tuition fees at empanelled private coaching centers and providing a monthly stipend of ₹2,500 for meritorious underprivileged students preparing for prestigious national competitive examinations.',
    category: 'Education',
    state: 'Delhi',
    governmentLevel: 'State',
    department: 'Department for the Welfare of SC/ST/OBC, Govt of NCT of Delhi',
    financialBenefitAmount: '100% Free Coaching (up to ₹1 Lakhs+ value) + ₹2,500/month living stipend',
    benefits: [
      'Entire course coaching fee paid directly by Delhi Government to empanelled institutions',
      'Monthly stipend of ₹2,500 credited to student account for study materials and travel',
      'Access to premier coaching institutes for UPSC, SSC, Banking, JEE, NEET, and Law'
    ],
    eligibility: [
      'Resident student of Delhi who completed 10th and 12th in Delhi',
      'Belonging to SC, ST, OBC, or EWS categories',
      'Annual family income must not exceed ₹8.0 Lakhs per annum'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 32,
      states: ['Delhi'],
      categories: ['SC', 'ST', 'OBC', 'EWS'],
      maxIncome: 800000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card with Delhi residence address',
      'Caste / EWS Certificate issued by competent Revenue authority in Delhi',
      'Income Certificate (Annual income under ₹8 Lakhs)',
      '10th and 12th Class Marksheets from Delhi schools',
      'Bank Account details in student’s name'
    ],
    applicationProcess: [
      'Enroll in any empanelled coaching institute under Jai Bhim scheme',
      'Institute verifies credentials and forwards application to Department of SC/ST/OBC Welfare',
      'Department issues sanction order and transfers tuition to institute and stipend to student'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://scstwelfare.delhigovt.nic.in',
    officialSource: 'Govt of NCT of Delhi, SC/ST/OBC Welfare Department',
    lastUpdated: 'August 2026',
    tags: ['delhi', 'state scheme', 'education', 'free coaching', 'jai bhim', 'stipend']
  },

  // ===================== WEST BENGAL =====================
  {
    id: 'west-bengal-svmcm',
    name: 'Swami Vivekananda Merit-cum-Means Scholarship (SVMCM) West Bengal',
    slug: 'west-bengal-svmcm',
    shortDescription: 'Financial scholarship of ₹1,000 to ₹5,000 per month for meritorious students pursuing HS, UG, PG, and PhD in West Bengal.',
    description: 'The Swami Vivekananda Merit-cum-Means Scholarship is the flagship merit-cum-means scheme of the Government of West Bengal providing substantial scholarships to meritorious students from economically weaker sections pursuing higher secondary, undergraduate, postgraduate, engineering, medical, and doctoral studies.',
    category: 'Scholarships',
    state: 'West Bengal',
    governmentLevel: 'State',
    department: 'Higher Education Department, Government of West Bengal',
    financialBenefitAmount: '₹12,000 to ₹60,000 per year (₹1,000 - ₹5,000/month)',
    benefits: [
      '₹1,000/month for Higher Secondary students (11th-12th)',
      '₹1,000 - ₹1,500/month for General Undergraduate degree courses',
      '₹5,000/month for Engineering, Medical, and Professional degree courses',
      'Direct Benefit Transfer directly into student’s savings bank account'
    ],
    eligibility: [
      'Resident of West Bengal studying in an educational institution within West Bengal',
      'Scored at least 60% marks in aggregate in previous qualifying board/university examination',
      'Total annual family income must NOT exceed ₹2.5 Lakhs per annum'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 30,
      states: ['West Bengal'],
      maxIncome: 250000,
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Madhyamik (10th) Admit Card for age proof',
      'Last qualifying examination Marksheet (min 60%)',
      'Income Certificate issued by competent government officer (BDO/SDO/Joint BDO)',
      'West Bengal Domicile proof / Ration card / Aadhaar card',
      'College Admission Receipt and Bank Passbook (Aadhaar linked)'
    ],
    applicationProcess: [
      'Register on SVMCM portal at svmcm.wbhed.gov.in',
      'Fill in applicant personal, academic, and income details',
      'Upload scanned marksheets, income certificate, and admission slip',
      'Institute nodal officer authenticates data and state disburses funds'
    ],
    deadline: '30 November 2026',
    deadlineDate: '2026-11-30',
    isDeadlineApproaching: false,
    officialWebsite: 'https://svmcm.wbhed.gov.in',
    officialSource: 'Higher Education Department, Government of West Bengal',
    lastUpdated: 'August 2026',
    tags: ['west bengal', 'state scheme', 'scholarship', 'svmcm', 'higher education', 'merit']
  },

  // ===================== RAJASTHAN =====================
  {
    id: 'rajasthan-anuprati',
    name: 'Rajasthan Mukhyamantri Anuprati Coaching Scheme',
    slug: 'rajasthan-anuprati-coaching',
    shortDescription: 'Free premier competitive coaching for IAS, RAS, IIT-JEE, NEET, CLAT + ₹40,000 annual boarding stipend for outstation students.',
    description: 'An educational scheme by the Social Justice and Empowerment Department of Rajasthan covering 100% course fees for prestigious competitive exams at renowned coaching institutes, along with ₹40,000 annual lodging assistance for students studying away from home.',
    category: 'Education',
    state: 'Rajasthan',
    governmentLevel: 'State',
    department: 'Social Justice and Empowerment Department, Government of Rajasthan',
    financialBenefitAmount: '100% Free Coaching + ₹40,000/year outstation residential stipend',
    benefits: [
      'Complete coaching fees paid directly to top-tier empanelled institutes (Allen, Utkarsh, Drishti, etc.)',
      '₹40,000 per year boarding and lodging allowance for students residing away from their home district',
      '30,000 seats reserved annually across various competitive courses'
    ],
    eligibility: [
      'Must be a permanent resident of Rajasthan',
      'Belonging to SC, ST, OBC, MBC, Minority, or EWS categories',
      'Annual family income must not exceed ₹8.0 Lakhs per annum'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 32,
      states: ['Rajasthan'],
      categories: ['SC', 'ST', 'OBC', 'EWS', 'Minority'],
      maxIncome: 800000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Jan Aadhaar Card / Rajasthan Mool Niwas Praman Patra',
      'Caste Certificate and Income Certificate',
      'Class 10th and 12th Board Marksheets'
    ],
    applicationProcess: [
      'Apply online on SSO Rajasthan portal (sso.rajasthan.gov.in) via SJMS portal',
      'Select exam and preferred coaching institute in Rajasthan',
      'Merit list released based on 10th/12th academic percentage'
    ],
    deadline: '31 October 2026',
    deadlineDate: '2026-10-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://sje.rajasthan.gov.in',
    officialSource: 'Social Justice and Empowerment Dept, Govt of Rajasthan',
    lastUpdated: 'August 2026',
    tags: ['rajasthan', 'state scheme', 'education', 'anuprati', 'free coaching', 'hostel allowance']
  },

  // ===================== MADHYA PRADESH =====================
  {
    id: 'mp-ladli-behna',
    name: 'Madhya Pradesh Mukhyamantri Ladli Behna Yojana',
    slug: 'mp-ladli-behna',
    shortDescription: 'Direct monthly financial aid of ₹1,250 (₹15,000/year) transferred into bank accounts of adult women aged 21-60 years.',
    description: 'Mukhyamantri Ladli Behna Yojana is a flagship social assistance initiative by the Government of Madhya Pradesh transferring ₹1,250 every month directly to eligible married, widowed, divorced, and deserted women to improve their health, nutrition, and financial independence.',
    category: 'Women',
    state: 'Madhya Pradesh',
    governmentLevel: 'State',
    department: 'Department of Women & Child Development, Government of Madhya Pradesh',
    financialBenefitAmount: '₹1,250 per month (₹15,000 per year) DBT',
    benefits: [
      'Direct monthly bank transfer of ₹1,250 deposited on the 10th of every month',
      'Guaranteed yearly financial assistance of ₹15,000',
      'Empowers women to meet personal and household nutrition and health requirements'
    ],
    eligibility: [
      'Permanent resident woman of Madhya Pradesh',
      'Age between 21 and 60 years',
      'Married, widowed, divorced, or separated',
      'Annual family income must not exceed ₹2.5 Lakhs per annum and family landholding under 5 acres'
    ],
    eligibilityRules: {
      minAge: 21,
      maxAge: 60,
      states: ['Madhya Pradesh'],
      genders: ['female'],
      maxIncome: 250000,
      maritalStatuses: ['Married', 'Widowed', 'Divorced']
    },
    requiredDocuments: [
      'Samagra Family ID and Individual Samagra Member ID (e-KYC verified)',
      'Aadhaar Card with biometric e-KYC',
      'Aadhaar-seeded bank account in applicant’s name'
    ],
    applicationProcess: [
      'Apply at Gram Panchayat / Ward Camps or online on cmladlibahna.mp.gov.in',
      'Complete biometric / OTP e-KYC on Samagra portal',
      'Application verified and enrolled for recurring monthly DBT transfer'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://cmladlibahna.mp.gov.in',
    officialSource: 'Women & Child Development, Govt of Madhya Pradesh',
    lastUpdated: 'August 2026',
    tags: ['madhya pradesh', 'mp', 'state scheme', 'women', 'ladli behna', 'dbt', 'cash transfer']
  },

  // ===================== GUJARAT =====================
  {
    id: 'gujarat-mysy',
    name: 'Gujarat Mukhyamantri Yuva Swavalamban Yojana (MYSY)',
    slug: 'gujarat-mysy',
    shortDescription: '50% tuition fee subsidy up to ₹2 Lakhs/year + ₹12,000 annual book/equipment grant for higher education in Gujarat.',
    description: 'MYSY is a major educational initiative by the Education Department of Gujarat providing up to 50% tuition fee assistance in engineering, medical, pharmacy, diploma, and degree courses for meritorious students scoring 80+ percentile.',
    category: 'Scholarships',
    state: 'Gujarat',
    governmentLevel: 'State',
    department: 'Education Department, Government of Gujarat',
    financialBenefitAmount: 'Up to ₹2,00,000/year Tuition Subsidy + ₹12,000/yr Hostel & Book Grant',
    benefits: [
      '50% Tuition fee subsidy (up to ₹2 Lakhs for Medical/Dental and ₹50,000 for Engineering/Pharmacy)',
      'Hostel food and lodging assistance of ₹1,200/month for students outside home taluka',
      'One-time book and equipment grant up to ₹10,000'
    ],
    eligibility: [
      'Resident of Gujarat who secured at least 80 percentile in 10th or 12th Board exam',
      'Admitted in recognized degree/diploma program in Gujarat',
      'Annual parental income must not exceed ₹6.0 Lakhs per annum'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 28,
      states: ['Gujarat'],
      maxIncome: 600000,
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)']
    },
    requiredDocuments: [
      'Aadhaar Card and Gujarat Domicile proof',
      '10th / 12th Board Marksheet showing 80+ percentile',
      'Income Certificate issued by Mamlatdar / TDO',
      'College Admission Slip & Tuition Fee Receipt',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    applicationProcess: [
      'Register on MYSY portal at mysy.guj.nic.in',
      'Fill in student academic credentials, college fee structure, and income details',
      'Verify documents at designated help centers across government colleges in Gujarat'
    ],
    deadline: '31 October 2026',
    deadlineDate: '2026-10-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://mysy.guj.nic.in',
    officialSource: 'Education Department, Government of Gujarat',
    lastUpdated: 'August 2026',
    tags: ['gujarat', 'state scheme', 'scholarship', 'mysy', 'higher education', 'merit']
  },

  // ===================== ANDHRA PRADESH =====================
  {
    id: 'ap-jagananna-vidya-deevena',
    name: 'Andhra Pradesh Jagananna Vidya Deevena & Vasathi Deevena',
    slug: 'ap-jagananna-vidya-deevena',
    shortDescription: '100% full fee reimbursement + ₹20,000 per year food and hostel accommodation grant for college students in AP.',
    description: 'Flagship education welfare program of the Government of Andhra Pradesh providing 100% full tuition fee reimbursement (credited directly to the student’s mother’s bank account) alongside ₹20,000 annual maintenance for Polytechnic, ITI, Degree, Engineering, and PG students.',
    category: 'Scholarships',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Social Welfare & Higher Education Department, Government of Andhra Pradesh',
    financialBenefitAmount: '100% Full Tuition Fee Reimbursement + ₹20,000/year Vasathi living stipend',
    benefits: [
      '100% Full Fee Reimbursement paid quarterly directly into the mother’s Aadhaar-linked bank account',
      'Annual maintenance assistance (Vasathi Deevena) of ₹20,000 for degree/engineering students (₹15,000 for polytechnic, ₹10,000 for ITI)',
      'Ensures zero student debt for higher education across Andhra Pradesh'
    ],
    eligibility: [
      'Permanent resident student of Andhra Pradesh',
      'Pursuing ITI, Polytechnic, Degree, Engineering, Medicine, or Postgraduate courses',
      'Family annual income must not exceed ₹2.5 Lakhs per annum',
      'Student must maintain minimum 75% attendance'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 32,
      states: ['Andhra Pradesh'],
      maxIncome: 250000,
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card of student and mother',
      'AP Rice Card / White Ration Card (or Income Certificate under ₹2.5 Lakhs)',
      'Integrated Caste Certificate',
      'College Admission details and Jnanabhumi student ID',
      'Mother’s Aadhaar-seeded Bank Account Passbook'
    ],
    applicationProcess: [
      'Student applies via College Principal / Nodal Officer on Jnanabhumi portal (jnanabhumi.ap.gov.in)',
      'Field verification completed by Village / Ward Sachivalayam volunteers',
      'Sanctions approved and credited in quarterly cycles via DBT'
    ],
    deadline: '15 November 2026',
    deadlineDate: '2026-11-15',
    isDeadlineApproaching: false,
    officialWebsite: 'https://jnanabhumi.ap.gov.in',
    officialSource: 'Government of Andhra Pradesh, Social Welfare Dept',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'state scheme', 'scholarship', 'vidya deevena', 'fee reimbursement']
  },

  // ===================== ODISHA =====================
  {
    id: 'odisha-kalia',
    name: 'Odisha KALIA Scheme (Krushak Assistance for Livelihood and Income Augmentation)',
    slug: 'odisha-kalia',
    shortDescription: 'Financial assistance of ₹10,000/year for small & marginal farmers and ₹12,500 for landless agricultural labourers in Odisha.',
    description: 'KALIA is a comprehensive agricultural and social welfare package by the Government of Odisha providing direct financial assistance for cultivation expenses to small and marginal farmers, alongside specialized livelihood assistance for landless farm labourers.',
    category: 'Agriculture',
    state: 'Odisha',
    governmentLevel: 'State',
    department: 'Department of Agriculture & Farmers Empowerment, Government of Odisha',
    financialBenefitAmount: '₹10,000 per year (₹4,000 state + PM-KISAN coordination) / ₹12,500 for landless labourers',
    benefits: [
      'Financial support for 5 cropping seasons for cultivating inputs',
      'Specialized livelihood support of ₹12,500 for landless agricultural households',
      'Life insurance coverage of ₹2 Lakhs and accidental cover of ₹2 Lakhs'
    ],
    eligibility: [
      'Resident farmer or landless agricultural labourer in Odisha',
      'Belonging to small or marginal farmer categories (less than 5 acres landholding)',
      'Holding Aadhaar-linked bank account'
    ],
    eligibilityRules: {
      minAge: 18,
      states: ['Odisha'],
      requiresFarmer: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Odisha Land Record / RoR (Record of Rights) or Landless declaration',
      'Ration Card',
      'Bank Account Passbook'
    ],
    applicationProcess: [
      'Apply online on the KALIA portal at kalia.odisha.gov.in or through Mo Seva Kendra centers',
      'Gram Panchayat level verification conducted for transparency',
      'Approved beneficiaries receive funds directly via DBT'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://kalia.odisha.gov.in',
    officialSource: 'Agriculture & FE Department, Government of Odisha',
    lastUpdated: 'August 2026',
    tags: ['odisha', 'state scheme', 'farmer', 'kalia', 'agriculture', 'dbt']
  },

  // ===================== KERALA =====================
  {
    id: 'kerala-vidyakiranam',
    name: 'Kerala Vidyakiranam Digital Education & Higher Education Welfare Scheme',
    slug: 'kerala-vidyakiranam',
    shortDescription: 'Free digital learning devices (laptops/tablets) and higher education financial support for underprivileged students in Kerala.',
    description: 'Vidyakiranam is an education empowerment initiative by the Government of Kerala aimed at bridging the digital divide by providing free laptops and digital learning tools to school and college students from economically backward, tribal, and coastal communities.',
    category: 'Education',
    state: 'Kerala',
    governmentLevel: 'State',
    department: 'General Education Department & Social Justice Dept, Government of Kerala',
    financialBenefitAmount: 'Free Branded Laptop / Tablet with internet connectivity + Education Grant',
    benefits: [
      'Free laptop/tablet equipped with high-speed internet connectivity',
      'Access to digital classrooms, Victers educational channel, and state university portals',
      'Direct grant assistance for collegiate higher education'
    ],
    eligibility: [
      'Permanent resident student of Kerala',
      'Enrolled in government or aided schools/colleges in Kerala',
      'Belonging to BPL families, Scheduled Castes, Scheduled Tribes, or traditional fishing communities'
    ],
    eligibilityRules: {
      minAge: 10,
      maxAge: 25,
      states: ['Kerala'],
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'BPL Ration Card or Village Officer Income Certificate',
      'School/College Bonafide Certificate'
    ],
    applicationProcess: [
      'School / College Principal nominates eligible students via Sametham portal or dcescholarship.kerala.gov.in',
      'Department of General Education approves beneficiary roster and distributes devices'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://dcescholarship.kerala.gov.in',
    officialSource: 'General Education Department, Government of Kerala',
    lastUpdated: 'August 2026',
    tags: ['kerala', 'state scheme', 'education', 'vidyakiranam', 'digital learning', 'student']
  },

  // ===================== BIHAR =====================
  {
    id: 'bihar-post-matric-scholarship',
    name: 'Bihar Post-Matric Scholarship Scheme (PMS Online Bihar)',
    slug: 'bihar-post-matric-scholarship',
    shortDescription: 'Complete tuition and compulsory course fee reimbursement and monthly maintenance stipend for Post-Matric SC, ST, BC, and EBC students in Bihar.',
    description: 'PMS Online Bihar is the official centralized scholarship portal of the Government of Bihar offering 100% reimbursement of non-refundable tuition fees and annual maintenance allowances to students pursuing Intermediate (11th/12th), ITI, Polytechnic, B.A., B.Sc., B.Com, B.Tech, MBBS, and Postgraduate programs.',
    category: 'Scholarships',
    state: 'Bihar',
    governmentLevel: 'State',
    department: 'Education Department & BC/EBC/SC/ST Welfare Department, Government of Bihar',
    financialBenefitAmount: '100% Tuition Fee Reimbursement + ₹2,000 to ₹15,000/year maintenance allowance',
    benefits: [
      '100% Course tuition fee and examination fee covered directly into student’s Aadhaar-seeded bank account',
      'Annual maintenance allowance up to ₹15,000 based on course tier and day-scholar/hosteller status',
      'Valid across government, semi-government, and recognized private universities/colleges inside & outside Bihar'
    ],
    eligibility: [
      'Permanent resident / domicile of Bihar State',
      'Belonging to SC, ST, BC (Backward Class), or EBC (Extremely Backward Class)',
      'Admitted in recognized Post-Matric course (Intermediate, Graduation, Diploma, ITI, Technical, Medical)',
      'Annual family income from all sources must not exceed ₹3,00,000 per annum'
    ],
    eligibilityRules: {
      minAge: 15,
      maxAge: 35,
      states: ['Bihar'],
      categories: ['SC', 'ST', 'OBC', 'EWS', 'Minority', 'General'],
      maxIncome: 300000,
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card of student',
      'Bihar Residential / Domicile Certificate (issued by Revenue Officer / SDO / CO)',
      'Caste Certificate issued by competent Bihar authority',
      'Current financial year Income Certificate (issued by Revenue Officer / CO)',
      '10th (Matric) Marksheet and College Bonafide Certificate with Fee Structure',
      'Aadhaar-seeded Bank Account Passbook with IFSC'
    ],
    applicationProcess: [
      'Visit official portal pmsonline.bih.nic.in and choose BC-EBC or SC-ST registration',
      'Enter Aadhaar, mobile number, and student personal credentials for OTP verification',
      'Upload residential, caste, income certificates, and college fee receipt',
      'Institute verifies course and fee details online; Welfare Department sanctions DBT disbursement'
    ],
    deadline: '30 November 2026',
    deadlineDate: '2026-11-30',
    isDeadlineApproaching: false,
    officialWebsite: 'https://pmsonline.bih.nic.in',
    officialSource: 'Government of Bihar, Education & Welfare Department',
    lastUpdated: 'August 2026',
    tags: ['bihar', 'state scheme', 'scholarship', 'pms online', 'post matric', 'student', 'higher education']
  },
  {
    id: 'bihar-student-credit-card',
    name: 'Bihar Student Credit Card Scheme (MNSSBY BSCC)',
    slug: 'bihar-student-credit-card',
    shortDescription: 'State-guaranteed education loan up to ₹4 Lakhs at ultra-concessional interest (1% for females/transgender/PwD, 4% for males) under 7 Nischay.',
    description: 'Under the Mukhyamantri Nischay Swayam Sahayata Bhatta Yojana (MNSSBY), the Bihar State Education Finance Corporation provides up to ₹4,00,000 education loans with zero collateral and full state government guarantee to Bihar students for pursuing professional and general higher education degrees.',
    category: 'Scholarships',
    state: 'Bihar',
    governmentLevel: 'State',
    department: 'Bihar State Education Finance Corporation (BSEFC), Govt of Bihar',
    financialBenefitAmount: 'Up to ₹4,00,000 Education Loan (1% simple interest for women/PwD, 4% for men; 0% during study)',
    benefits: [
      'Loan amount up to ₹4 Lakhs covering college tuition fees, hostel expenses, books, and laptop',
      'Moratorium period covers full course duration plus 1 additional year or 6 months after securing job',
      'Zero personal or parental property collateral required; 100% state guaranteed'
    ],
    eligibility: [
      'Permanent resident of Bihar state, aged up to 25 years at time of application',
      'Passed Class 12th (Intermediate) or equivalent from Bihar School Examination Board (BSEB) or recognized board in Bihar',
      'Enrolled in or secured admission to recognized degree, diploma, technical, or professional institution'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 27,
      states: ['Bihar'],
      requiresStudent: true,
      minEducation: ['12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)']
    },
    requiredDocuments: [
      'Aadhaar Card of applicant and co-applicant (parent/guardian)',
      '10th and 12th Marksheet & Certificate',
      'Bihar Residence / Domicile Certificate',
      'Admission letter / Bonafide certificate from recognized college/university with detailed fee schedule',
      'Bank Passbook of applicant showing bank account details'
    ],
    applicationProcess: [
      'Register on 7 Nischay portal at www.7nishchay-yuvaupmission.bihar.gov.in',
      'Fill online BSCC application form and book appointment at District Registration and Counseling Centre (DRCC)',
      'Visit your district DRCC counter for physical document verification',
      'BSEFC sanctions and disburses fee directly to the educational institution'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.7nishchay-yuvaupmission.bihar.gov.in',
    officialSource: 'Department of Planning & Development, Govt of Bihar',
    lastUpdated: 'August 2026',
    tags: ['bihar', 'state scheme', 'education loan', 'bscc', '7 nischay', 'student credit card', 'higher education']
  },
  {
    id: 'mukhyamantri-kanya-utthan-bihar',
    name: 'Mukhyamantri Kanya Utthan Yojana (MKUY Bihar)',
    slug: 'mukhyamantri-kanya-utthan-bihar',
    shortDescription: 'Direct cash assistance of ₹50,000 on college graduation and ₹25,000 on intermediate pass for girls in Bihar.',
    description: 'Mukhyamantri Kanya Utthan Yojana is the Bihar Government premier initiative to incentivize female education, eliminate child marriage, and achieve gender empowerment. It transfers ₹50,000 directly into the bank accounts of female graduates from recognized colleges in Bihar.',
    category: 'Women',
    state: 'Bihar',
    governmentLevel: 'State',
    department: 'Education Department, Government of Bihar (Medhasoft Portal)',
    financialBenefitAmount: '₹50,000 for female Graduates & ₹25,000 for Intermediate female students (DBT)',
    benefits: [
      '₹50,000 lump sum direct bank transfer upon graduating from any recognized university in Bihar',
      '₹25,000 incentive upon passing Intermediate (Class 12) examinations',
      'Direct financial independence for career launch, competitive exams, or master’s studies'
    ],
    eligibility: [
      'Permanent resident female citizen of Bihar',
      'Completed Graduation (B.A., B.Sc., B.Com, Engineering, Medicine, Vocational) from recognized university in Bihar',
      'Or passed 12th / Intermediate from BSEB as an unmarried girl'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 35,
      states: ['Bihar'],
      genders: ['female']
    },
    requiredDocuments: [
      'Aadhaar Card of the female applicant',
      'Bihar Domicile / Residence Certificate',
      'Graduation Final Year Marksheet & Degree Certificate / Registration Slip',
      'Aadhaar-seeded Bank Passbook in the applicant girl individual name',
      'Active mobile number and email ID'
    ],
    applicationProcess: [
      'Visit medhasoft.bih.nic.in and navigate to "Mukhyamantri Kanya Utthan Yojana (Snatak)"',
      'Verify University, College registration number, roll number, and marks',
      'Submit Aadhaar validation and bank account details for PFMS integration',
      'Institutional approval is performed by College Registrar followed by direct DBT credit'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://medhasoft.bih.nic.in',
    officialSource: 'Education Department, Government of Bihar',
    lastUpdated: 'August 2026',
    tags: ['bihar', 'state scheme', 'women', 'kanya utthan', 'scholarship', 'graduation', 'medhasoft', 'dbt']
  },
  {
    id: 'mukhyamantri-balak-balika-protsahan-bihar',
    name: 'Mukhyamantri Balak / Balika Protsahan Yojana (BSEB 10th Pass)',
    slug: 'mukhyamantri-balak-balika-protsahan-bihar',
    shortDescription: 'Direct cash incentive of ₹10,000 for Class 10th (Matric) students passing with 1st division in Bihar.',
    description: 'Under this flagship program by the Government of Bihar, all male and female students passing the BSEB Class 10 Matriculation Examination in First Division receive a one-time DBT grant of ₹10,000, while SC and ST students passing in Second Division receive ₹8,000.',
    category: 'Scholarships',
    state: 'Bihar',
    governmentLevel: 'State',
    department: 'Education Department & Social Welfare Dept, Government of Bihar',
    financialBenefitAmount: '₹10,000 one-time DBT cash reward (₹8,000 for SC/ST 2nd Division)',
    benefits: [
      'Direct cash reward deposited into student’s bank account to support intermediate admissions and study material',
      'Universal eligibility across all religious communities and social categories for 1st division holders'
    ],
    eligibility: [
      'Permanent resident of Bihar',
      'Passed Class 10 (Matric) examination from Bihar School Examination Board (BSEB)',
      'Secured First Division (General, BC, EBC, SC, ST) or Second Division (SC/ST)'
    ],
    eligibilityRules: {
      minAge: 14,
      maxAge: 24,
      states: ['Bihar'],
      requiresStudent: true,
      minEducation: ['10th Pass (Matric)', '12th Pass (Intermediate)']
    },
    requiredDocuments: [
      'BSEB 10th Class Roll Code, Roll Number, and Marksheet',
      'Aadhaar Card of student',
      'Bihar Residence Certificate',
      'Active Bank Account Passbook in student’s name'
    ],
    applicationProcess: [
      'Access medhasoft.bih.nic.in and select "Mukhyamantri Balak/Balika (10th Passed) Protsahan Yojana"',
      'Input BSEB Matric Roll Code and Roll Number to auto-fetch student marks',
      'Verify Aadhaar details and bank account mapping',
      'DBT credit sanctioned directly upon automated district validation'
    ],
    deadline: '31 October 2026',
    deadlineDate: '2026-10-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://medhasoft.bih.nic.in',
    officialSource: 'Government of Bihar, Education Department',
    lastUpdated: 'August 2026',
    tags: ['bihar', 'state scheme', 'scholarship', '10th pass', 'medhasoft', 'protsahan', 'matric', 'student']
  },
  {
    id: 'mukhyamantri-udyami-yojana-bihar',
    name: 'Mukhyamantri Udyami Yojana (Bihar MSME Entrepreneurship Scheme)',
    slug: 'mukhyamantri-udyami-yojana-bihar',
    shortDescription: 'Financial support up to ₹10 Lakhs (₹5 Lakhs grant + ₹5 Lakhs interest-free/1% loan) for setting up micro enterprises in Bihar.',
    description: 'The Mukhyamantri Udyami Yojana (encompassing SC/ST, EBC, Mahila, and Yuva Udyami variants) is Bihar premier industrial self-employment initiative. The state provides ₹10,00,000 for setting up manufacturing and service enterprises, of which 50% (₹5 Lakhs) is a non-repayable grant.',
    category: 'Business',
    state: 'Bihar',
    governmentLevel: 'State',
    department: 'Department of Industries, Government of Bihar',
    financialBenefitAmount: '₹10 Lakhs total assistance: ₹5 Lakhs grant/subsidy (50%) + ₹5 Lakhs loan at 0% to 1% interest',
    benefits: [
      '50% capital subsidy (up to ₹5,00,000) non-repayable grant',
      'Remaining ₹5,00,000 as soft loan payable in 84 monthly installments (7 years) with 0% interest for women/SC/ST and 1% for youth',
      '₹25,000 additional training stipend per unit for skill development and enterprise mentoring'
    ],
    eligibility: [
      'Permanent resident of Bihar State',
      'Age between 18 and 50 years',
      'Minimum education: 10+2 / Intermediate, ITI, Polytechnic, Diploma, or Graduation',
      'Unit must be registered as Sole Proprietorship, Partnership, LLP, or Pvt Ltd in Bihar'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 50,
      states: ['Bihar'],
      minEducation: ['12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card and PAN Card',
      'Permanent Residential / Domicile Certificate of Bihar',
      '10th Certificate (for DOB verification) and Intermediate / Degree Marksheet',
      'Caste Certificate (for SC/ST/EBC applicants)',
      'Current Bank Account Statement / Cancelled Cheque'
    ],
    applicationProcess: [
      'Register online at udyami.bihar.gov.in with Aadhaar and mobile OTP',
      'Choose project from approved manufacturing, agro-processing, or service sectors',
      'Upload educational certificates, domicile, and caste documents',
      'Selection done via computerized lottery followed by mandatory 2-week entrepreneurship training'
    ],
    deadline: 'Open in Cycles (2026 Cycle)',
    deadlineDate: '2026-11-15',
    isDeadlineApproaching: false,
    officialWebsite: 'https://udyami.bihar.gov.in',
    officialSource: 'Department of Industries, Government of Bihar',
    lastUpdated: 'August 2026',
    tags: ['bihar', 'state scheme', 'business', 'entrepreneurship', 'udyami', 'startup', 'subsidy', 'msme']
  },
  {
    id: 'bihar-diesel-anudan-krishi',
    name: 'Bihar Krishi Diesel Anudan & Crop Input Subsidy',
    slug: 'bihar-diesel-anudan-krishi',
    shortDescription: 'Direct irrigation fuel subsidy of ₹75/litre (₹750/acre per irrigation) to protect standing crops for Bihar farmers.',
    description: 'The Agriculture Department of Bihar provides Diesel Anudan to compensate farmers for irrigation expenses using diesel pump sets during dry spells. Beneficiaries receive ₹75 per litre for irrigating paddy, maize, pulses, oilseeds, and vegetables directly into their bank accounts.',
    category: 'Agriculture',
    state: 'Bihar',
    governmentLevel: 'State',
    department: 'Department of Agriculture, Government of Bihar (DBT Agriculture)',
    financialBenefitAmount: '₹750 per acre per irrigation cycle (₹75/litre diesel subsidy up to 5 acres)',
    benefits: [
      'Subsidized irrigation cost for Kharif, Rabi, and summer crops',
      'Direct Benefit Transfer into farmer bank account within 2-3 weeks of application',
      'Open to both owner farmers and tenant/bataydar sharecroppers'
    ],
    eligibility: [
      'Resident farmer of Bihar with registered Farmer ID on DBT Agriculture portal',
      'Owns cultivable agricultural land or verified bataydar (sharecropper) in Bihar',
      'Purchased diesel from authorized petrol pump in Bihar with diesel cash memo'
    ],
    eligibilityRules: {
      minAge: 18,
      states: ['Bihar'],
      requiresFarmer: true
    },
    requiredDocuments: [
      '13-digit Bihar Farmer Registration ID (DBT Agriculture Portal)',
      'Aadhaar Card',
      'Computerized Diesel Purchase Receipt (with registration ID endorsed)',
      'Land Revenue Receipt (LPC) or Bataydar Self-Declaration (Form 2)'
    ],
    applicationProcess: [
      'Apply online on dbtagriculture.bihar.gov.in',
      'Select "Diesel Subsidy Application" and enter Farmer Registration ID',
      'Upload digital copy of computerized diesel purchase memo',
      'Agriculture Coordinator and Circle Officer verify land and sanction DBT'
    ],
    deadline: 'Open Seasonal Cycles',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://dbtagriculture.bihar.gov.in',
    officialSource: 'Department of Agriculture, Government of Bihar',
    lastUpdated: 'August 2026',
    tags: ['bihar', 'state scheme', 'farmer', 'agriculture', 'diesel subsidy', 'irrigation', 'dbt']
  },
  {
    id: 'mukhyamantri-vridhjan-pension-bihar',
    name: 'Mukhyamantri Vridhjan Pension Yojana (MVPY Bihar - SSPMIS)',
    slug: 'mukhyamantri-vridhjan-pension-bihar',
    shortDescription: 'Universal monthly old-age pension of ₹400 to ₹500 for all senior citizens aged 60+ in Bihar.',
    description: 'Under Mukhyamantri Vridhjan Pension Yojana, the Government of Bihar guarantees social security and dignified living to all elderly citizens. Unlike central pensions, it is non-contributory and universal for all seniors not receiving government pension.',
    category: 'Social Security',
    state: 'Bihar',
    governmentLevel: 'State',
    department: 'Social Welfare Department, Government of Bihar (SSPMIS Portal)',
    financialBenefitAmount: '₹400/month (ages 60-79) and ₹500/month (age 80+) direct monthly lifetime pension',
    benefits: [
      'Guaranteed direct monthly financial support credited on the 1st week of each month',
      'Universal coverage without mandatory BPL card restriction'
    ],
    eligibility: [
      'Permanent resident of Bihar aged 60 years or above',
      'Not receiving any state/central government employee pension or EPF pension',
      'Valid Bihar Aadhaar card and active bank account in Bihar'
    ],
    eligibilityRules: {
      minAge: 60,
      maxAge: 110,
      states: ['Bihar']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Bihar Residence Certificate or Voter ID card',
      'Aadhaar-seeded Bank Account Passbook',
      'Aadhaar Consent / Self Declaration Form'
    ],
    applicationProcess: [
      'Visit sspmis.bihar.gov.in or nearest RTPS counter at Block Development Office',
      'Submit Aadhaar details for UIDAI verification',
      'Block Welfare Officer (BWO) reviews application and Sub-Divisional Officer (SDO) approves',
      'Monthly pension disbursed via Direct Benefit Transfer through PFMS'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://sspmis.bihar.gov.in',
    officialSource: 'Social Welfare Department, Government of Bihar',
    lastUpdated: 'August 2026',
    tags: ['bihar', 'state scheme', 'pension', 'senior citizen', 'vridhjan', 'social welfare', 'sspmis']
  }
];
