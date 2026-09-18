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
  {
    id: 'telangana-overseas-vidya-nidhi',
    name: 'Telangana Overseas Vidya Nidhi Scheme (Ambedkar & Jyotiba Phule)',
    slug: 'telangana-overseas-vidya-nidhi',
    shortDescription: 'Financial assistance grant of ₹20 Lakhs plus one-way airfare for BC, EBC, SC, ST, and Minority students pursuing PG or PhD abroad.',
    description: 'The Government of Telangana sanctions ₹20,00,000 financial grant in two installments along with visa facilitation and flight tickets to eligible meritorious backward class, scheduled caste, and minority students from Telangana pursuing Masters and Doctoral programs in accredited foreign universities in the USA, UK, Australia, Canada, and Germany.',
    category: 'Scholarships',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'BC Welfare & Scheduled Castes Development Department, Govt of Telangana',
    financialBenefitAmount: '₹20,00,000 Direct Grant + One-way Economy Airfare',
    benefits: [
      '₹20 Lakhs direct financial assistance disbursed in two installments (₹10 Lakhs upon landing and ₹10 Lakhs upon passing 1st semester)',
      'One-way flight passage charges and visa processing fee reimbursement',
      'Exemption from institutional loan collateral for international studies'
    ],
    eligibility: [
      'Must be a permanent domiciled resident of Telangana State',
      'Belonging to BC, EBC, SC, ST, or Minority communities',
      'Maximum age limit of 35 years as on the date of notification',
      'Annual family income from all sources must not exceed ₹5.00 Lakhs per annum',
      'Must have secured minimum 60% marks in Graduation (Degree / Engineering)',
      'Valid score in GRE / GMAT / TOEFL / IELTS and confirmed I-20 or admission letter'
    ],
    eligibilityRules: {
      minAge: 20,
      maxAge: 35,
      states: ['Telangana'],
      categories: ['OBC', 'SC', 'ST', 'EWS', 'Minority'],
      maxIncome: 500000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card with Telangana residential address',
      'Integrated Caste and Domicile Certificate issued by MeeSeva',
      'Income Certificate issued by Tahsildar (under ₹5 Lakhs)',
      'Graduation Degree Certificate & Consolidated Marksheet (min 60%)',
      'GRE / GMAT and TOEFL / IELTS score cards',
      'Foreign University Admission Offer Letter & I-20 Form',
      'Valid Indian Passport and Student Visa copy'
    ],
    applicationProcess: [
      'Apply online on Telangana ePASS Overseas portal (telanganaepass.cgg.gov.in)',
      'Upload academic records, foreign university admission letter, and MeeSeva certificates',
      'Attend state verification interview and counseling before the State Selection Committee',
      'Sanction proceedings issued and funds credited via foreign currency DBT'
    ],
    deadline: '30 October 2026',
    deadlineDate: '2026-10-30',
    isDeadlineApproaching: false,
    officialWebsite: 'https://telanganaepass.cgg.gov.in',
    officialSource: 'BC Welfare Department & SCDD, Government of Telangana',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'overseas scholarship', 'vidya nidhi', 'masters', 'phd', 'foreign studies']
  },
  {
    id: 'telangana-vidya-jyothi',
    name: 'Telangana Chief Minister’s Meritorious Student Academic Assistance',
    slug: 'telangana-vidya-jyothi',
    shortDescription: 'Annual incentive grant of ₹20,000 to ₹35,000 and free digital study kit for college students in Telangana.',
    description: 'Special welfare assistance scheme enacted by the Government of Telangana to support undergraduate, polytechnic, engineering, and medical students with textbook grants, digital learning kits, and living allowances.',
    category: 'Scholarships',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Higher Education Department, Government of Telangana',
    financialBenefitAmount: '₹25,000 annual academic allowance + digital study toolkit',
    benefits: [
      'Direct annual cash incentive of ₹25,000 directly deposited into the student’s bank account',
      'Subsidized digital equipment and academic textbook allowance',
      'Coverage for college examination fees and hostel maintenance'
    ],
    eligibility: [
      'Permanent domiciled resident student of Telangana',
      'Currently enrolled in full-time recognized degree, diploma, or professional university courses in Telangana',
      'Annual family income under ₹2.5 Lakhs per annum',
      'Minimum 75% attendance in current academic year'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 30,
      states: ['Telangana'],
      maxIncome: 250000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card showing Telangana address',
      'Current College Bonafide / Study Certificate',
      'Income Certificate issued by Tahsildar',
      'Previous semester / year marks sheet',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    applicationProcess: [
      'Apply online via Telangana ePASS or Praja Palana student services portal',
      'College Principal verifies student bonafide details and semester attendance',
      'District Welfare Officer approves the DBT sanction'
    ],
    deadline: '15 November 2026',
    deadlineDate: '2026-11-15',
    isDeadlineApproaching: false,
    officialWebsite: 'https://telanganaepass.cgg.gov.in',
    officialSource: 'Higher Education Department, Government of Telangana',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'scholarship', 'student', 'college', 'academic assistance']
  },
  {
    id: 'telangana-task-training',
    name: 'Telangana Academy for Skill and Knowledge (TASK) Youth Training Subsidy',
    slug: 'telangana-task-training',
    shortDescription: '100% subsidized industry-aligned IT, AI, electronics, and aerospace certifications and placement drives for Telangana college students.',
    description: 'An initiative of the IT, E&C Department, Government of Telangana, to enhance employability and industry readiness among degree, polytechnic, and engineering students across Telangana through subsidized corporate skill certifications and campus drives.',
    category: 'Student Welfare',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Information Technology, Electronics & Communications (ITE&C), Govt of Telangana',
    financialBenefitAmount: '100% subsidized technology certifications (worth ₹50,000+) & direct recruitment drives',
    benefits: [
      'Full subsidy on global tech certifications in Cloud, AI, Full-Stack, VLSI, and Automotive software',
      'Exclusive recruitment placement drives with top tech and manufacturing MNCs',
      'Soft skills, aptitude, and interview preparation workshops'
    ],
    eligibility: [
      'Students pursuing Polytechnic, Degree, B.Tech, MCA, or MBA in recognized Telangana colleges',
      'Domicile of Telangana State',
      'Age between 17 and 28 years'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 28,
      states: ['Telangana'],
      requiresStudent: true
    },
    requiredDocuments: [
      'College Identity Card',
      'Aadhaar Card with Telangana address',
      'Semester Enrollment confirmation'
    ],
    applicationProcess: [
      'Register online on TASK official portal (task.telangana.gov.in) with student college roll number',
      'Select technical training modules and industry partner tracks',
      'Attend online/offline labs and appear for campus recruitment'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://task.telangana.gov.in',
    officialSource: 'ITE&C Department, Government of Telangana',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'skill development', 'training', 'task', 'student', 'jobs']
  },
  {
    id: 'telangana-rythu-bharosa',
    name: 'Telangana Rythu Bharosa Farmer Investment Support Scheme',
    slug: 'telangana-rythu-bharosa',
    shortDescription: 'Direct financial assistance of ₹15,000 per acre per year for farmers and tenant cultivators in Telangana.',
    description: 'Rythu Bharosa is the flagship agriculture input and livelihood assistance initiative of the Government of Telangana providing ₹15,000 per acre annually for Kharif and Rabi crop cultivation to landowning farmers and verified tenant cultivators.',
    category: 'Agriculture',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Agriculture and Cooperation Department, Government of Telangana',
    financialBenefitAmount: '₹15,000 per acre per year (₹7,500 per crop season)',
    benefits: [
      '₹15,000 per acre annually credited directly to farmer bank account via DBT',
      'Covers seeds, fertilizers, pesticides, field preparation, and labour costs',
      'Free crop insurance coverage under state agricultural welfare guidelines'
    ],
    eligibility: [
      'Farmer or tenant cultivator resident in Telangana',
      'Holding agricultural land recorded in Dharani portal',
      'Tenant cultivators with authorized cultivation registration cards'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 100,
      states: ['Telangana']
    },
    requiredDocuments: [
      'Pattadar Passbook / Dharani Land Record Record',
      'Aadhaar Card of cultivator',
      'Aadhaar-seeded Bank Passbook'
    ],
    applicationProcess: [
      'Land records auto-verified through Dharani portal database',
      'Tenant cultivators submit applications through Village Agriculture Extension Officer (AEO)',
      'DBT credited directly before each sowing season'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://dharani.telangana.gov.in',
    officialSource: 'Government of Telangana, Agriculture Department',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'agriculture', 'farmer', 'rythu bharosa', 'dbt']
  },
  {
    id: 'telangana-kalyana-lakshmi',
    name: 'Telangana Kalyana Lakshmi & Shaadi Mubarak Scheme',
    slug: 'telangana-kalyana-lakshmi',
    shortDescription: 'One-time financial assistance of ₹1,00,116 for marriage of brides from SC, ST, BC, EBC, and Minority families.',
    description: 'The Government of Telangana sanctions one-time financial support of ₹1,00,116 to unmarried girls belonging to SC, ST, BC, EBC, and Minority communities at the time of marriage to alleviate financial burdens on vulnerable families.',
    category: 'Women',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Scheduled Castes Development & Backward Classes Welfare Dept, Telangana',
    financialBenefitAmount: '₹1,00,116 One-Time Marriage Financial Grant',
    benefits: [
      '₹1,00,116 deposited directly into the bank account of the bride’s mother',
      'Prevents child marriage by enforcing strict 18+ age verification',
      'Covers marriage expenses and provides economic security'
    ],
    eligibility: [
      'Bride must be a permanent resident of Telangana State',
      'Must have completed 18 years of age at marriage',
      'Belonging to SC, ST, BC, EBC, or Minority communities',
      'Combined parental income must not exceed ₹2,00,000 per year'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 40,
      states: ['Telangana'],
      genders: ['female'],
      maxIncome: 200000
    },
    requiredDocuments: [
      'Bride and Groom’s Aadhaar Cards and Age Proofs (SSC or Birth Certificate)',
      'Income Certificate issued by Tahsildar (under ₹2 Lakhs)',
      'Caste Certificate issued through MeeSeva',
      'Marriage Invitation Card and Wedding Photo',
      'Aadhaar-seeded Bank Account of Bride’s Mother'
    ],
    applicationProcess: [
      'Apply online on Telangana ePASS Kalyana Lakshmi portal',
      'Upload bride, groom, and parents KYC and marriage documents',
      'Local Revenue Inspector and Tahsildar conduct physical verification and issue sanction'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://telanganaepass.cgg.gov.in',
    officialSource: 'Government of Telangana, Department of Welfare',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'women', 'marriage assistance', 'kalyana lakshmi', 'shaadi mubarak']
  },
  {
    id: 'telangana-aarogyasri',
    name: 'Telangana Rajiv Aarogyasri Universal Health Scheme',
    slug: 'telangana-aarogyasri',
    shortDescription: 'Cashless medical treatment up to ₹10,00,000 per family per year in empanelled government and private super-specialty hospitals.',
    description: 'Rajiv Aarogyasri is the flagship cashless healthcare insurance scheme of the Government of Telangana providing free in-patient treatment, surgery, and follow-up care up to ₹10 Lakhs per family annually across 1,600+ network hospitals.',
    category: 'Healthcare',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Aarogyasri Health Care Trust, Department of Health, Medical & Family Welfare, Telangana',
    financialBenefitAmount: '₹10,00,000 Cashless Medical Coverage per family per year',
    benefits: [
      '100% cashless hospitalization, surgical procedures, diagnostics, and ICU care up to ₹10 Lakhs',
      'Free post-operative medicines and follow-up consultation package',
      'Coverage for 1,672+ secondary and tertiary medical and surgical therapies'
    ],
    eligibility: [
      'Permanent resident family in Telangana State',
      'Holding Telangana Food Security Card (White Ration Card) or Aarogyasri Health Card',
      'No age restriction'
    ],
    eligibilityRules: {
      minAge: 0,
      maxAge: 100,
      states: ['Telangana']
    },
    requiredDocuments: [
      'Aarogyasri Card or Telangana Food Security Card (White Ration Card)',
      'Aadhaar Card of patient and family members'
    ],
    applicationProcess: [
      'Visit any empanelled network government or private hospital in Telangana',
      'Approach Aarogya Mithra helpdesk with Ration Card and Aadhaar Card',
      'Instant electronic pre-authorization and cashless treatment admission'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://aarogyasri.telangana.gov.in',
    officialSource: 'Aarogyasri Health Care Trust, Government of Telangana',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'state scheme', 'healthcare', 'aarogyasri', 'hospital', 'cashless health']
  },

  // ===================== ANDHRA PRADESH =====================
  {
    id: 'ap-annadata-sukhibhava',
    name: 'Andhra Pradesh Annadata Sukhibhava - PM KISAN Scheme',
    slug: 'ap-annadata-sukhibhava',
    shortDescription: 'Annual financial support of ₹20,000 per farmer family in Andhra Pradesh (integrating ₹6,000 PM-KISAN + ₹14,000 AP State Assistance).',
    description: 'Flagship farmer welfare initiative launched by the Government of Andhra Pradesh (formerly YSR Rythu Bharosa) providing ₹20,000 annual financial aid directly to farmer bank accounts to cover seed, fertilizer, and crop cultivation expenses.',
    category: 'Agriculture',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Department of Agriculture & Cooperation, Government of Andhra Pradesh',
    financialBenefitAmount: '₹20,000 per year (₹14,000 State + ₹6,000 PM-KISAN DBT)',
    benefits: [
      '₹20,000 annual direct cash transfer credited into farmer bank accounts in three seasonal installments',
      'Extends coverage to both landholding farmers and tenant farmers holding CCRC cards',
      'Free 9-hour daytime agricultural power supply and crop insurance protection'
    ],
    eligibility: [
      'Farmer resident of Andhra Pradesh owning agricultural land or recognized tenant cultivator',
      'Tenant farmers holding valid Crop Cultivator Rights Card (CCRC)',
      'Registered on e-Crop portal with active Aadhaar DBT bank account'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 100,
      states: ['Andhra Pradesh'],
      requiresFarmer: true
    },
    requiredDocuments: [
      'Pattadar Passbook / 1B Land record title',
      'Crop Cultivator Rights Card (CCRC) for tenant cultivators',
      'Aadhaar Card and Aadhaar-seeded Bank Passbook'
    ],
    applicationProcess: [
      'Farmer registration through Rythu Seva Kendras / Village Secretariats',
      'Social audit and verification via e-Crop and Navasakam portal',
      'Direct DBT credit into beneficiary bank account'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://navasakam2.apcfss.in',
    officialSource: 'Government of Andhra Pradesh, Agriculture Department',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'annadata sukhibhava', 'farmer', 'rythu bharosa', 'agriculture', 'dbt', 'super six']
  },
  {
    id: 'ap-ntr-vaidya-seva',
    name: 'Dr. NTR Vaidya Seva Universal Health Scheme',
    slug: 'ap-ntr-vaidya-seva',
    shortDescription: 'Cashless medical treatment up to ₹25,00,000 per family per year in empanelled corporate and government hospitals across AP and major cities.',
    description: 'Dr. NTR Vaidya Seva (formerly Dr. YSR Aarogyasri) provides 100% cashless hospitalization up to ₹25 Lakhs per family annually covering 3,257 medical, surgical, oncology, and transplant procedures in network hospitals across Andhra Pradesh, Hyderabad, Bengaluru, and Chennai.',
    category: 'Healthcare',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Dr. NTR Vaidya Seva Trust, Government of Andhra Pradesh',
    financialBenefitAmount: '₹25,00,000 Cashless Hospitalization per family per year + Post-operative recovery allowance',
    benefits: [
      'Complete cashless hospital coverage up to ₹25,00,000 for 3,257 notified medical procedures',
      'Aarogya Aasara post-operative recuperative financial allowance of up to ₹5,000 per month',
      'Access to top multi-specialty network hospitals in AP, Hyderabad, Bengaluru, and Chennai'
    ],
    eligibility: [
      'Resident families of Andhra Pradesh with annual family income under ₹5 Lakhs',
      'Holding AP Rice Card (White Ration Card) or NTR Vaidya Seva Health Card'
    ],
    eligibilityRules: {
      minAge: 0,
      maxAge: 100,
      states: ['Andhra Pradesh'],
      maxIncome: 500000
    },
    requiredDocuments: [
      'Aadhaar Card of patient',
      'AP Rice Card / NTR Vaidya Seva Card',
      'Medical prescription or referral from government hospital/empanelled centre'
    ],
    applicationProcess: [
      'Visit any empanelled network hospital in AP, Hyderabad, Bengaluru, or Chennai',
      'Approach Vaidya Seva Mithra at the hospital helpdesk',
      'Instant electronic pre-authorization and free cashless admission'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://aarogyasri.ap.gov.in',
    officialSource: 'Dr. NTR Vaidya Seva Trust, Government of Andhra Pradesh',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'ntr vaidya seva', 'healthcare', 'aarogyasri', 'cashless hospital', 'health card']
  },
  {
    id: 'ap-thalliki-vandanam',
    name: 'Andhra Pradesh Thalliki Vandanam Scheme',
    slug: 'ap-thalliki-vandanam',
    shortDescription: 'Annual financial incentive of ₹15,000 for every school-going child deposited directly into the mother’s bank account under the Super Six initiative.',
    description: 'Thalliki Vandanam is an education incentive scheme under the Andhra Pradesh Super Six welfare package (restructured from the earlier Amma Vodi) that provides ₹15,000 per year per student to the mother’s account for all eligible school-going children in the household.',
    category: 'Scholarships',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'School Education Department, Government of Andhra Pradesh',
    financialBenefitAmount: '₹15,000 per school-going child per year',
    benefits: [
      '₹15,000 direct benefit transfer credited into the mother’s Aadhaar-linked bank account',
      'Applicable to all school-going children from Class 1 to 12 in the family',
      'Supports school fees, uniform, stationery, and nutritional requirements'
    ],
    eligibility: [
      'Mother or recognized guardian of student studying in Class 1 to Intermediate (12th)',
      'Permanent resident of Andhra Pradesh',
      'Enrolled in recognized government, aided, or private schools/colleges',
      'Family annual income under ₹2.5 Lakhs (holding Rice Card)'
    ],
    eligibilityRules: {
      minAge: 5,
      maxAge: 19,
      states: ['Andhra Pradesh'],
      maxIncome: 250000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card of student and mother',
      'White Ration Card / AP Rice Card',
      'School Bonafide / Student Information System (UDISE) record',
      'Mother’s Bank Account Passbook'
    ],
    applicationProcess: [
      'School Headmaster verifies student enrollment and attendance on Child Info portal',
      'Village / Ward Sachivalayam conducts social audit verification',
      'Direct DBT credit by Andhra Pradesh Government into mother’s bank account'
    ],
    deadline: '31 October 2026',
    deadlineDate: '2026-10-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://jnanabhumi.ap.gov.in',
    officialSource: 'Department of School Education, Government of Andhra Pradesh',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'thalliki vandanam', 'amma vodi', 'education', 'school grant', 'super six']
  },
  {
    id: 'ap-deepam-2-gas-scheme',
    name: 'Andhra Pradesh Deepam 2.0 Scheme (3 Free LPG Cylinders)',
    slug: 'ap-deepam-2-gas-scheme',
    shortDescription: 'Free 3 LPG domestic cooking gas cylinders per year for eligible poor families in Andhra Pradesh under the Super Six guarantees.',
    description: 'Launched by the Government of Andhra Pradesh under the Super Six initiative, Deepam 2.0 supplies 3 free domestic LPG cylinders annually (one cylinder every 4 months) through direct DBT subsidy reimbursement to eligible BPL households.',
    category: 'Social Security',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Civil Supplies & Consumer Affairs Department, Government of Andhra Pradesh',
    financialBenefitAmount: '3 Free Domestic LPG Gas Cylinders per year (Full cost DBT subsidy)',
    benefits: [
      '3 free domestic LPG cylinder refills provided annually to beneficiary families',
      'Direct subsidy reimbursement into bank account within 48 hours of gas delivery',
      'Promotes smoke-free healthy kitchens and clean fuel access for women'
    ],
    eligibility: [
      'Permanent resident of Andhra Pradesh',
      'Valid AP White Ration Card / Rice Card',
      'Active domestic LPG gas connection in the name of a female family member'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 90,
      states: ['Andhra Pradesh']
    },
    requiredDocuments: [
      'Aadhaar Card of LPG consumer',
      'AP Rice Card / Ration Card',
      'LPG Connection Consumer Passbook (HP, Bharat, or Indane)',
      'Aadhaar-linked Bank Account'
    ],
    applicationProcess: [
      'Link Aadhaar and Rice Card with your local LPG gas agency',
      'Book standard domestic refill through regular agency or online portal',
      'Refill subsidy is automatically refunded directly into bank account via DBT'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://spandana.ap.gov.in',
    officialSource: 'Civil Supplies Department, Government of Andhra Pradesh',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'deepam scheme', 'lpg gas', 'free cylinder', 'super six', 'women']
  },
  {
    id: 'ap-ntr-bharosa-pension',
    name: 'Andhra Pradesh NTR Bharosa Social Security Pension Scheme',
    slug: 'ap-ntr-bharosa-pension',
    shortDescription: 'Monthly social security pension of ₹4,000 for senior citizens, widows, and weavers, and ₹6,000 for persons with disabilities (PwD) delivered at doorstep.',
    description: 'NTR Bharosa (formerly YSR Pension Kanuka) is the enhanced social security pension scheme in Andhra Pradesh under which monthly pensions have been enhanced from ₹3,000 to ₹4,000 per month for old age, widows, weavers, and single women, and ₹6,000 for disabled citizens.',
    category: 'Pension',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Department of Social Welfare & SERP, Government of Andhra Pradesh',
    financialBenefitAmount: '₹4,000/month (Old Age/Widows) | ₹6,000/month (PwD) | ₹15,000/month (Kidney dialysis/chronic)',
    benefits: [
      '₹4,000 monthly pension delivered directly at the beneficiary’s doorstep on the 1st of every month',
      'Enhanced ₹6,000 monthly support for persons with severe disabilities',
      'Financial dignity and reliable livelihood protection for senior citizens and destitute individuals'
    ],
    eligibility: [
      'Resident of Andhra Pradesh',
      'Old Age Pension: Age 60 years or above',
      'Widow Pension: Widowed woman of any age holding death certificate of spouse',
      'Disabled Pension: Minimum 40% disability certified under SADAREM',
      'Total family income under ₹1.44 Lakh (Rural) or ₹1.20 Lakh (Urban)'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 100,
      states: ['Andhra Pradesh']
    },
    requiredDocuments: [
      'Aadhaar Card of beneficiary',
      'White Ration Card / AP Rice Card',
      'Age proof / SADAREM disability certificate (for PwD) / Spouse death certificate (for Widows)',
      'Bank Account details'
    ],
    applicationProcess: [
      'Apply at nearest Village / Ward Sachivalayam (Gram/Ward Secretariat)',
      'Field verification by Welfare & Education Assistant',
      'Sanction orders issued and pension disbursed on 1st of every month'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://sspensions.ap.gov.in',
    officialSource: 'Society for Elimination of Rural Poverty (SERP), Andhra Pradesh',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'ntr bharosa', 'pension', 'old age', 'widow', 'pwd', 'social security']
  },
  {
    id: 'ap-vidya-deevena-reimbursement',
    name: 'Andhra Pradesh Vidya Deevena (Complete Fee Reimbursement via JnanaBhumi)',
    slug: 'ap-vidya-deevena-reimbursement',
    shortDescription: '100% full tuition fee reimbursement credited directly for ITI, Polytechnic, Degree, Engineering, and PG students in Andhra Pradesh.',
    description: 'Flagship higher education welfare program of the Government of Andhra Pradesh providing 100% full tuition fee reimbursement directly for students pursuing polytechnic, engineering, pharmacy, degree, and postgraduate courses via the official JnanaBhumi portal.',
    category: 'Scholarships',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Social Welfare & Higher Education Department, Government of Andhra Pradesh',
    financialBenefitAmount: '100% Full Tuition Fee Reimbursement paid directly to colleges/mothers',
    benefits: [
      '100% Full Fee Reimbursement paid quarterly directly into bank account',
      'Zero tuition burden for polytechnic, degree, engineering, pharmacy, and postgraduate students',
      'Promotes educational attainment across underprivileged communities in Andhra Pradesh'
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
      'Integrated Caste Certificate issued via MeeSeva',
      'College Admission details and Jnanabhumi student ID',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    applicationProcess: [
      'Student applies via College Principal / Nodal Officer on Jnanabhumi portal (jnanabhumi.ap.gov.in)',
      'Field verification completed by Village / Ward Sachivalayam staff',
      'Sanctions approved and credited in quarterly cycles via DBT'
    ],
    deadline: '15 November 2026',
    deadlineDate: '2026-11-15',
    isDeadlineApproaching: false,
    officialWebsite: 'https://jnanabhumi.ap.gov.in',
    officialSource: 'Government of Andhra Pradesh, Social Welfare Dept',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'state scheme', 'scholarship', 'vidya deevena', 'fee reimbursement', 'jnanabhumi']
  },
  {
    id: 'ap-vasathi-deevena-grant',
    name: 'Andhra Pradesh Vasathi Deevena (Hostel & Boarding Grant via JnanaBhumi)',
    slug: 'ap-vasathi-deevena-grant',
    shortDescription: 'Annual financial assistance of ₹20,000 for degree/engineering, ₹15,000 for polytechnic, and ₹10,000 for ITI students for food & hostel expenses.',
    description: 'Vasathi Deevena provides annual financial aid to meet boarding, lodging, and hostel expenses of college students from low-income families in Andhra Pradesh, credited in two installments into the mother’s account.',
    category: 'Scholarships',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Social Welfare & Backward Classes Welfare Department, Government of Andhra Pradesh',
    financialBenefitAmount: '₹20,000/year (Degree/Engg) | ₹15,000/year (Polytechnic) | ₹10,000/year (ITI)',
    benefits: [
      '₹20,000 per year for Degree & Engineering students in 2 installments',
      '₹15,000 per year for Polytechnic diploma students',
      '₹10,000 per year for Industrial Training Institute (ITI) students',
      'Covers hostel mess charges, room rents, and study materials'
    ],
    eligibility: [
      'Permanent resident student of Andhra Pradesh',
      'Enrolled in recognized ITI, Polytechnic, Degree, or Professional Engineering courses',
      'Family annual income under ₹2.5 Lakhs per annum',
      'Must maintain 75% attendance'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 32,
      states: ['Andhra Pradesh'],
      maxIncome: 250000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card of student and mother',
      'AP Rice Card / FSC / Income Certificate',
      'College Bonafide Study Certificate',
      'Mother’s Bank Passbook'
    ],
    applicationProcess: [
      'Applied concurrently with Vidya Deevena on Jnanabhumi portal',
      'College Principal certifies semester enrollment and attendance',
      'Disbursed through Navasakam DBT gateway'
    ],
    deadline: '15 November 2026',
    deadlineDate: '2026-11-15',
    isDeadlineApproaching: false,
    officialWebsite: 'https://jnanabhumi.ap.gov.in',
    officialSource: 'Government of Andhra Pradesh, Social Welfare Dept',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'state scheme', 'scholarship', 'vasathi deevena', 'hostel grant']
  },
  {
    id: 'ap-videshi-vidya-scheme',
    name: 'Andhra Pradesh Overseas Study Grant (JnanaBhumi Videshi Vidya)',
    slug: 'ap-videshi-vidya-scheme',
    shortDescription: 'Financial grant up to ₹1.25 Crore for SC, ST, BC, Minority, and EWS students securing admission in top 100 QS-ranked global universities.',
    description: 'The Government of Andhra Pradesh sanctions financial grants up to ₹1.25 Crore (100% of tuition and living fees for top 50 QS universities, and up to ₹50 Lakhs for top 51–100 universities) for meritorious underprivileged students pursuing Master’s or PhD degrees abroad.',
    category: 'Scholarships',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Higher Education & Social Welfare Department, Government of Andhra Pradesh',
    financialBenefitAmount: 'Up to ₹1.25 Crore (Full Fee + Living Stipend + Airfare)',
    benefits: [
      '100% tuition fee and living expenses up to ₹1.25 Crore for admissions in top 50 QS-ranked universities',
      'Up to ₹50 Lakhs or 100% tuition for QS rank 51 to 100 institutions',
      'One-way flight passage and visa counseling facilitation'
    ],
    eligibility: [
      'Permanent resident of Andhra Pradesh',
      'Belonging to SC, ST, BC, Minority, or EWS category',
      'Family income not exceeding ₹8 Lakhs per annum',
      'Age below 35 years',
      'Secured unconditional admission in top 100 QS World University Rankings'
    ],
    eligibilityRules: {
      minAge: 20,
      maxAge: 35,
      states: ['Andhra Pradesh'],
      categories: ['SC', 'ST', 'OBC', 'EWS', 'Minority'],
      maxIncome: 800000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card and AP Domicile Certificate',
      'Caste Certificate and Income Certificate from MeeSeva',
      'Unconditional admission offer letter from QS top 100 university',
      'GRE / GMAT / IELTS / TOEFL score report',
      'Valid Passport and Student Visa'
    ],
    applicationProcess: [
      'Register on Jnanabhumi Videshi Vidya portal',
      'Upload university offer letter and academic credentials',
      'Scrutiny by State Level Selection Committee and release of DBT milestone payments'
    ],
    deadline: '30 November 2026',
    deadlineDate: '2026-11-30',
    isDeadlineApproaching: false,
    officialWebsite: 'https://jnanabhumi.ap.gov.in',
    officialSource: 'Government of Andhra Pradesh, Higher Education Dept',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'state scheme', 'overseas scholarship', 'videshi vidya', 'foreign studies']
  },
  {
    id: 'ap-yuva-galam-unemployment-aid',
    name: 'Andhra Pradesh Yuva Galam Unemployment Allowance Scheme',
    slug: 'ap-yuva-galam-unemployment-aid',
    shortDescription: 'Monthly financial assistance of ₹3,000 per month for educated unemployed youth in Andhra Pradesh to support skill development and competitive exam preparation.',
    description: 'Part of the Super Six welfare agenda of the Government of Andhra Pradesh, Yuva Galam provides ₹3,000 per month to eligible unemployed diploma, degree, and postgraduate youths in AP to cover skill training and job application expenses.',
    category: 'Employment',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'Skill Development & Youth Welfare Department, Government of Andhra Pradesh',
    financialBenefitAmount: '₹3,000 per month direct allowance',
    benefits: [
      '₹3,000 per month direct stipend credited into candidate bank account',
      'Free industry certification and placement training via AP Skill Development Corporation (APSSDC)',
      'Financial support during competitive exam coaching and job searches'
    ],
    eligibility: [
      'Resident youth of Andhra Pradesh aged 18 to 35 years',
      'Minimum qualification of Polytechnic Diploma, ITI, Graduate Degree, or PG',
      'Currently unemployed and registered with AP Employment Exchange',
      'Family annual income under ₹2.5 Lakhs'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 35,
      states: ['Andhra Pradesh'],
      maxIncome: 250000,
      minEducation: ['Diploma/ITI', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card of applicant',
      'Educational Degree / Diploma Certificate and Marks Memo',
      'AP Employment Exchange registration card',
      'Aadhaar-linked Bank Passbook'
    ],
    applicationProcess: [
      'Register on AP Skill / Spandana Portal',
      'Verification of degree and unemployment status',
      'Monthly allowance credited directly to account'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://apssdc.in',
    officialSource: 'AP Skill Development Corporation, Government of Andhra Pradesh',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'yuva galam', 'unemployment allowance', 'youth', 'super six', 'employment']
  },
  {
    id: 'ap-sunna-vaddi-dwcra',
    name: 'Andhra Pradesh Sunna Vaddi (Zero Interest DWCRA Loans)',
    slug: 'ap-sunna-vaddi-dwcra',
    shortDescription: '100% full interest subvention for DWCRA Self Help Group (SHG) women on bank loans up to ₹5,00,000 in Andhra Pradesh.',
    description: 'Sunna Vaddi ensures zero interest on bank loans taken by DWCRA Self Help Groups in Andhra Pradesh. The state government directly reimburses the entire bank interest amount into the SHG members’ accounts, ensuring zero interest burden on women entrepreneurs.',
    category: 'Women',
    state: 'Andhra Pradesh',
    governmentLevel: 'State',
    department: 'SERP & MEPMA, Department of Rural Development, Government of Andhra Pradesh',
    financialBenefitAmount: '100% Interest Subvention on SHG bank loans up to ₹5,00,000',
    benefits: [
      '100% interest reimbursement credited directly to SHG bank accounts',
      'Eliminates interest burden on petty shop owners, weavers, vegetable vendors, and SHG women',
      'Strengthens women credit rating and livelihood enterprises'
    ],
    eligibility: [
      'Women belonging to registered rural (SERP) or urban (MEPMA) DWCRA Self Help Groups in AP',
      'Bank loan amount up to ₹5,00,000 with regular monthly repayments'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 70,
      states: ['Andhra Pradesh'],
      genders: ['female']
    },
    requiredDocuments: [
      'SHG Group Registration details and Member Aadhaar Cards',
      'SHG Bank Loan Passbook showing regular repayments',
      'Rice Card / FSC'
    ],
    applicationProcess: [
      'SHG applies through Village Organization (VO) / Slum Level Federation (SLF)',
      'Bank submits repayment and interest claim to SERP/MEPMA',
      'Government disburses 100% interest subsidy directly to SHG account'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://navasakam2.apcfss.in',
    officialSource: 'Society for Elimination of Rural Poverty (SERP), Andhra Pradesh',
    lastUpdated: 'August 2026',
    tags: ['andhra pradesh', 'ap', 'sunna vaddi', 'dwcra', 'women', 'shg', 'interest free loan']
  }
];
