import { Scheme } from '../types';
import { STATE_SCHEMES } from './stateSchemes';

export { STATE_SCHEMES };

const BASE_SCHEMES: Scheme[] = [
  {
    id: 'pm-scholarship-scheme',
    name: 'PM Scholarship Scheme (PMSS) for Higher Technical & Professional Education',
    slug: 'pm-scholarship-scheme',
    shortDescription: 'Financial scholarship for wards and widows of ex-servicemen, paramilitary, and police personnel pursuing professional technical degree courses.',
    description: 'The Prime Minister’s Scholarship Scheme (PMSS) was introduced to encourage higher technical and professional education for dependent wards & widows of Central Armed Police Forces & Assam Rifles (CAPFs & AR) and State Police Personnel.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Welfare and Rehabilitation Board (WARB), Ministry of Home Affairs & Ministry of Defence',
    financialBenefitAmount: '₹3,000/month for Girls, ₹2,500/month for Boys',
    benefits: [
      '₹36,000 per annum for girl students (₹3,000 per month)',
      '₹30,000 per annum for boy students (₹2,500 per month)',
      'Tenure lasts from 1 to 5 years depending on the professional degree course duration'
    ],
    eligibility: [
      'Wards/widows of deceased/ex-CAPFs, AR & State Police personnel killed in terrorist/Naxalite violence',
      'Must be pursuing first professional degree programmes (BE, B.Tech, MBBS, BDS, B.Pharm, BCA, MBA, MCA, etc.)',
      'Minimum 60% marks in 10+2 / Diploma / Graduation as entry qualification',
      'Age limit generally 18 to 25 years during admission'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 26,
      genders: ['male', 'female', 'other'],
      requiresStudent: true,
      minEducation: ['12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Service / Ex-Servicemen Certificate or PPO',
      '10+2 / Diploma Mark Sheet (min 60%)',
      'Bonafide Certificate from University/College',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Certificate from State Police Headquarter (for State Police quota)'
    ],
    applicationProcess: [
      'Register on the National Scholarship Portal (NSP) with Aadhaar authentication',
      'Select Prime Minister’s Scholarship Scheme under Central Schemes / Ministry of Home Affairs',
      'Fill in student academic details, college bonafide data, and parent service details',
      'Upload verified certificates (Service Certificate, marksheets, bonafide)',
      'Submit application and track status via NSP portal'
    ],
    deadline: '30 October 2026',
    deadlineDate: '2026-10-30',
    isDeadlineApproaching: false,
    officialWebsite: 'https://scholarships.gov.in',
    officialSource: 'National Scholarship Portal (NSP), Govt of India',
    lastUpdated: 'August 2026',
    tags: ['scholarship', 'student', 'higher education', 'defence', 'technical degree']
  },
  {
    id: 'central-sector-scheme-university-college',
    name: 'Central Sector Scheme of Scholarships for College and University Students',
    slug: 'central-sector-scholarship',
    shortDescription: 'Scholarship by Department of Higher Education for meritorious students with family income under ₹4.5 Lakhs.',
    description: 'A flagship merit-cum-means scholarship implemented by the Department of Higher Education, Ministry of Education, Government of India, to provide financial assistance to meritorious students from low-income families.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Department of Higher Education, Ministry of Education',
    financialBenefitAmount: '₹12,000/yr for Graduation & ₹20,000/yr for Post-Graduation',
    benefits: [
      '₹12,000 per year at Graduation level for the first three years',
      '₹20,000 per year at Post-Graduation level for two years',
      'Direct Benefit Transfer (DBT) directly into Aadhaar-seeded bank account'
    ],
    eligibility: [
      'Students above 80th percentile of successful candidates in relevant stream from respective Class 12 Board',
      'Pursuing regular (not correspondence/distance) degree courses in recognized colleges/universities',
      'Gross parental/family annual income must NOT exceed ₹4.5 Lakhs per annum',
      'Student should not be availing of any other national scholarship'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 25,
      maxIncome: 450000,
      requiresStudent: true,
      minEducation: ['12th Pass (Intermediate)', 'Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Class 12th Board Mark Sheet & Percentile proof',
      'Income Certificate issued by competent government authority (Tehsildar/SDM)',
      'College Admission / Bonafide Student Certificate',
      'Aadhaar linked Bank Account Passbook',
      'Category/Caste Certificate (if applicable)'
    ],
    applicationProcess: [
      'Visit the National Scholarship Portal (NSP) at scholarships.gov.in',
      'Apply under Department of Higher Education -> Central Sector Scheme',
      'Provide 12th Board Roll Number, year, and verification details',
      'Submit institutional verification form to your college nodal officer',
      'Verification completed by Institute and State Nodal Officer for DBT disbursement'
    ],
    deadline: '15 November 2026',
    deadlineDate: '2026-11-15',
    isDeadlineApproaching: false,
    officialWebsite: 'https://scholarships.gov.in',
    officialSource: 'Ministry of Education, Government of India',
    lastUpdated: 'August 2026',
    tags: ['scholarship', 'college', 'university', 'merit', 'education']
  },
  {
    id: 'pm-kisan-samman-nidhi',
    name: 'PM Kisan Samman Nidhi Yojana (PM-KISAN)',
    slug: 'pm-kisan-samman-nidhi',
    shortDescription: 'Income support of ₹6,000 per year in 3 equal installments of ₹2,000 for all cultivable landholding farmer families.',
    description: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme providing financial support to landholding farmer families to procure agricultural inputs and manage domestic needs.',
    category: 'Agriculture',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Department of Agriculture and Farmers Welfare',
    financialBenefitAmount: '₹6,000 per year (3 installments of ₹2,000 each)',
    benefits: [
      '₹6,000 per year directly transferred to bank accounts in 3 four-monthly installments',
      'Assists farmers in procuring seeds, fertilizers, equipment, and livestock care',
      'Automated DBT transfer linked via e-KYC and NPCI mapping'
    ],
    eligibility: [
      'All landholding farmer families having cultivable land in their names (subject to exclusion criteria)',
      'Exclusions include institutional landholders, government employees, income tax payees, and pension holders > ₹10,000/month',
      'Must have valid Aadhaar and e-KYC verification completed on PM-KISAN portal'
    ],
    eligibilityRules: {
      minAge: 18,
      requiresFarmer: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Land Ownership Records (Khatauni / RoR / 7/12 Extract / Patta)',
      'Aadhaar-seeded active Bank Account details',
      'Mobile Number linked with Aadhaar (for OTP e-KYC)'
    ],
    applicationProcess: [
      'Visit the official PM-KISAN portal at pmkisan.gov.in',
      'Click on "New Farmer Registration" under Farmers Corner',
      'Enter Aadhaar number, state, mobile number and verify via OTP',
      'Fill in land record details (Survey no., Khasra no., Area in Ha)',
      'Complete biometric or OTP e-KYC and check beneficiary status'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://pmkisan.gov.in',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['farmer', 'agriculture', 'income support', 'dbt', 'kisan']
  },
  {
    id: 'pm-yasasvi-scholarship',
    name: 'PM Young Achievers Scholarship Award Scheme for Vibrant India (PM-YASASVI)',
    slug: 'pm-yasasvi-scholarship',
    shortDescription: 'Top-class school & college scholarship for OBC, EBC, and DNT students with family income under ₹2.5 Lakhs.',
    description: 'PM-YASASVI is a comprehensive umbrella scheme by the Ministry of Social Justice and Empowerment for OBC, Economically Backward Class (EBC), and De-Notified Nomadic Tribes (DNT) students studying in identified top schools and colleges.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Ministry of Social Justice and Empowerment',
    financialBenefitAmount: '₹75,000/yr (Class 9-10) to ₹1,25,000/yr (Class 11-12) & Full Higher Ed Support',
    benefits: [
      '₹75,000 per year for Class 9 & 10 students',
      '₹1,25,000 per year for Class 11 & 12 students in shortlisted top schools',
      'Full tuition fee and living allowance for students in top higher education institutions'
    ],
    eligibility: [
      'Belonging to OBC, EBC or DNT categories',
      'Annual family income from all sources must not exceed ₹2.5 Lakhs',
      'Studying in Class 9, 10, 11, 12 in top designated schools or pursuing higher education',
      'Selection based on merit / qualifying criteria'
    ],
    eligibilityRules: {
      minAge: 13,
      maxAge: 25,
      categories: ['OBC', 'EWS'],
      maxIncome: 250000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Valid OBC / EBC / DNT Category Certificate',
      'Income Certificate (Annual family income < ₹2.5 Lakhs)',
      'Previous Class Marksheet (min 60% recommended)',
      'School / College Admission Proof & ID card',
      'Bank Account Passbook'
    ],
    applicationProcess: [
      'Visit the National Scholarship Portal (NSP) at scholarships.gov.in',
      'Search under Ministry of Social Justice and Empowerment -> PM YASASVI',
      'Register with Aadhaar and fill academic, caste, and income credentials',
      'Upload required documents and submit for school verification'
    ],
    deadline: '9 September 2026 (Closing in 3 Days)',
    deadlineDate: '2026-09-09',
    isDeadlineApproaching: true,
    officialWebsite: 'https://scholarships.gov.in',
    officialSource: 'Ministry of Social Justice and Empowerment',
    lastUpdated: 'August 2026',
    tags: ['scholarship', 'obc', 'ebc', 'dnt', 'school', 'top class']
  },
  {
    id: 'pragati-scholarship-for-girls',
    name: 'AICTE Pragati Scholarship Scheme for Girl Students',
    slug: 'pragati-scholarship-for-girls',
    shortDescription: 'Empowering girl students pursuing technical diploma or degree education in AICTE approved colleges with ₹50,000/year.',
    description: 'Implemented by All India Council for Technical Education (AICTE), Pragati scheme aims to provide assistance for advancement of girls pursuing technical education (degree and diploma level).',
    category: 'Women',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'All India Council for Technical Education (AICTE)',
    financialBenefitAmount: '₹50,000 per annum for tuition & study material',
    benefits: [
      '₹50,000 per year for every year of study as lump-sum amount towards college fee, computer purchase, books, and stationeries',
      'Total 10,000 scholarships disbursed annually across India'
    ],
    eligibility: [
      'Only female students admitted to 1st year of Degree/Diploma course in AICTE approved institution (or 2nd year via lateral entry)',
      'Maximum two girl children per family eligible',
      'Family income from all sources must be less than ₹8 Lakhs per annum'
    ],
    eligibilityRules: {
      minAge: 16,
      maxAge: 28,
      genders: ['female'],
      maxIncome: 800000,
      requiresStudent: true,
      minEducation: ['12th Pass (Intermediate)', 'Diploma/ITI', 'Undergraduate (UG)']
    },
    requiredDocuments: [
      'Aadhaar Card of the Student',
      'Class 10th and 12th Marksheets',
      'AICTE Approved College Admission Letter & Fee Receipt',
      'Annual Family Income Certificate (under ₹8 Lakhs)',
      'Family declaration for maximum 2 girl children',
      'Aadhaar Seeded Bank Passbook'
    ],
    applicationProcess: [
      'Apply through the National Scholarship Portal (scholarships.gov.in)',
      'Select AICTE Schemes -> Pragati Scholarship Scheme (Degree or Diploma)',
      'Enter AICTE Institute Permanent ID, admission details, and bank account',
      'Institution verification followed by AICTE state nodal approval'
    ],
    deadline: '31 October 2026',
    deadlineDate: '2026-10-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://scholarships.gov.in',
    officialSource: 'AICTE, Ministry of Education',
    lastUpdated: 'August 2026',
    tags: ['women', 'girls', 'aicte', 'technical', 'engineering', 'scholarship']
  },
  {
    id: 'sukanya-samriddhi-yojana',
    name: 'Sukanya Samriddhi Yojana (SSY) - Beti Bachao Beti Padhao',
    slug: 'sukanya-samriddhi-yojana',
    shortDescription: 'High-interest government-backed small deposit savings scheme for girl child with tax exemption under Section 80C.',
    description: 'A government of India-backed small savings scheme launched as part of the "Beti Bachao, Beti Padhao" campaign to build a fund for girl child education and marriage.',
    category: 'Women',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Ministry of Finance & Department of Posts',
    financialBenefitAmount: '8.2% Compound Interest p.a. + Triple Tax Exemption (EEE)',
    benefits: [
      'Attractive high interest rate (currently 8.2% p.a. compounded yearly)',
      'Triple Tax Exemption (Exempt-Exempt-Exempt) under 80C, interest income, and maturity amount',
      'Partial withdrawal up to 50% allowed for higher education after girl turns 18'
    ],
    eligibility: [
      'Account can be opened by parents/legal guardians for a girl child below the age of 10 years',
      'Maximum 2 accounts per family (or 3 in case of twins/triplets in first/second birth)',
      'Minimum deposit ₹250/year and maximum deposit ₹1,50,000/year'
    ],
    eligibilityRules: {
      minAge: 0,
      maxAge: 10,
      genders: ['female']
    },
    requiredDocuments: [
      'Birth Certificate of the Girl Child',
      'Aadhaar Card and PAN Card of Parent/Guardian',
      'Address Proof (Electricity bill, Ration card, Voter ID)',
      'Passport size photographs of Parent/Guardian and Girl'
    ],
    applicationProcess: [
      'Visit any Post Office branch or authorized public/private commercial bank (SBI, PNB, BoB, Canara, etc.)',
      'Fill Sukanya Samriddhi Account Opening Form (Form-1)',
      'Submit birth certificate, guardian KYC documents, and initial deposit (min ₹250)',
      'Receive SSY Passbook containing account number and deposit ledger'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.indiapost.gov.in',
    officialSource: 'Department of Posts & Ministry of Finance, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['girl child', 'savings', 'women', 'tax free', 'education fund']
  },
  {
    id: 'pm-mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    slug: 'pm-mudra-yojana',
    shortDescription: 'Collateral-free business loans up to ₹20 Lakhs for micro and small enterprises, startups, shopkeepers, and artisans.',
    description: 'PMMY enables micro and small non-corporate, non-farm enterprises to access collateral-free institutional credit in Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L), and Tarun Plus (up to ₹20L) categories.',
    category: 'Business',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Department of Financial Services, Ministry of Finance',
    financialBenefitAmount: 'Collateral-free loans from ₹50,000 to ₹20,00,000',
    benefits: [
      'No collateral or third-party guarantee required',
      'Nominal processing fees and competitive interest rates',
      'MUDRA Card providing working capital credit facility like an ATM/Debit card'
    ],
    eligibility: [
      'Any Indian citizen having a business plan for non-farm income generating activity (manufacturing, trading, services, allied agri)',
      'Includes small shopkeepers, artisans, street vendors, small industries, food processors, transport operators',
      'Applicant must not be a defaulter to any bank or financial institution'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 65,
      requiresBusinessOwner: true
    },
    requiredDocuments: [
      'Aadhaar Card and PAN Card',
      'Business Registration / Udyam Aadhaar / Shop & Establishment Act Certificate (if registered)',
      'Business Plan / Quotation of machinery/items to be purchased',
      'Last 6 months Bank Statement',
      'Proof of Business Address and residential address'
    ],
    applicationProcess: [
      'Apply online on JanSamarth Portal (jansamarth.in) or Udyamimitra portal (udyamimitra.in)',
      'Select category: Shishu (<₹50k), Kishore (₹50k-5L), Tarun (₹5L-10L), Tarun Plus (10L-20L)',
      'Select preferred lending partner bank / NBFC / MFI',
      'Upload business proposal and submit for instant in-principle sanction'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.mudra.org.in',
    officialSource: 'MUDRA Ltd & Department of Financial Services',
    lastUpdated: 'August 2026',
    tags: ['business', 'loan', 'entrepreneur', 'startup', 'collateral free', 'msme']
  },
  {
    id: 'pm-vishwakarma-yojana',
    name: 'PM Vishwakarma Scheme',
    slug: 'pm-vishwakarma-yojana',
    shortDescription: 'Holistic support, certified skill training, ₹15,000 toolkit incentive, and collateral-free credit at 5% interest for traditional artisans and craftspeople.',
    description: 'A Central Sector Scheme to support traditional artisans and craftspeople engaged in 18 traditional trades (carpenter, blacksmith, goldsmith, potter, sculptor, cobbler, tailor, mason, barber, weaver, etc.).',
    category: 'Employment',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    financialBenefitAmount: '₹15,000 Toolkit Grant + Collateral-free Loan up to ₹3 Lakhs @ 5%',
    benefits: [
      'PM Vishwakarma Certificate & Digital ID Card recognition',
      'Basic skill training (5-7 days) & Advanced training (15+ days) with ₹500/day stipend',
      '₹15,000 modern toolkit financial incentive directly into bank account',
      'Enterprise development loan: 1st tranche ₹1,00,000 & 2nd tranche ₹2,00,000 at concessional 5% interest'
    ],
    eligibility: [
      'Artisan or craftsperson working with hands and tools in one of the 18 eligible trades on self-employment basis',
      'Minimum age 18 years on the date of registration',
      'Only one member of the family is eligible for benefits under the scheme',
      'Not availed loans under PMEGP, PM SVANidhi, or MUDRA in the last 5 years'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 70,
      requiresArtisan: true
    },
    requiredDocuments: [
      'Aadhaar Card (Aadhaar authentication mandatory)',
      'Active Mobile Number linked with Aadhaar',
      'Bank Account Passbook with IFSC code',
      'Ration Card / Family Proof document'
    ],
    applicationProcess: [
      'Visit nearest Common Services Center (CSC) or official portal at pmvishwakarma.gov.in',
      'CSC VLE performs biometric Aadhaar verification and trade registration',
      'Gram Panchayat / Urban Local Body conducts field verification of artisan trade',
      'District Implementation Committee and Screening Committee approve application'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://pmvishwakarma.gov.in',
    officialSource: 'Ministry of MSME, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['artisan', 'craftsperson', 'employment', 'vocational', 'toolkit', 'loan']
  },
  {
    id: 'ayushman-bharat-pmjay',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    slug: 'ayushman-bharat-pmjay',
    shortDescription: 'Cashless secondary and tertiary healthcare coverage of up to ₹5 Lakhs per family per year, including all senior citizens aged 70+.',
    description: 'The world’s largest government-funded health assurance scheme, providing free secondary and tertiary care hospitalization coverage of ₹5 Lakh per year per family across 29,000+ empaneled hospitals.',
    category: 'Health',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'National Health Authority (NHA), Ministry of Health & Family Welfare',
    financialBenefitAmount: '₹5,00,000 free cashless hospital treatment per family per year',
    benefits: [
      'Cashless and paperless access to services at points of delivery in private and public empaneled hospitals',
      'Covers 1,949 medical and surgical procedures, surgeries, medicines, diagnostics, pre & post hospitalization',
      'Universal coverage expanded for ALL senior citizens aged 70 years and above irrespective of income'
    ],
    eligibility: [
      'Households identified under SECC 2011 / NFSA / RSBY / State ration database',
      'All Indian senior citizens aged 70 years and above (under PM-JAY Senior Citizen Universal Top-up)',
      'No cap on family size, age, or gender; pre-existing diseases covered from Day 1'
    ],
    eligibilityRules: {
      minAge: 0,
      maxAge: 110,
      maxIncome: 500000
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card (NFSA / BPL / Priority Household card)',
      'Mobile number for e-KYC authentication'
    ],
    applicationProcess: [
      'Visit beneficiary.nha.gov.in portal or download the Ayushman App',
      'Login as "Beneficiary" using Mobile Number and OTP',
      'Search family using Aadhaar number, PMJAY ID, or Ration Card number',
      'Complete biometric / face / OTP e-KYC',
      'Download the official PVC Ayushman Vaya Vandana Card'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://beneficiary.nha.gov.in',
    officialSource: 'National Health Authority, Ministry of Health and Family Welfare',
    lastUpdated: 'August 2026',
    tags: ['health', 'insurance', 'hospital', 'cashless', 'ayushman card', 'senior citizen']
  },
  {
    id: 'atal-pension-yojana',
    name: 'Atal Pension Yojana (APY)',
    slug: 'atal-pension-yojana',
    shortDescription: 'Guaranteed government monthly pension of ₹1,000 to ₹5,000 after age 60 for unorganized sector workers.',
    description: 'A flagship social security scheme launched to provide a guaranteed monthly pension to citizens working in the unorganized sector upon reaching the age of 60.',
    category: 'Pension',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Pension Fund Regulatory and Development Authority (PFRDA), Ministry of Finance',
    financialBenefitAmount: 'Guaranteed Monthly Pension of ₹1,000 to ₹5,000 for lifetime',
    benefits: [
      'Guaranteed pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 per month depending on contribution',
      'Same pension amount guaranteed to spouse upon death of subscriber',
      'Accumulated pension wealth returned to nominee after death of both subscriber and spouse',
      'Tax benefits under Section 80CCD(1B)'
    ],
    eligibility: [
      'Any Indian citizen between the ages of 18 and 40 years',
      'Must possess a savings bank account with auto-debit facility',
      'Must NOT be an income tax payer (as per revised guidelines effective Oct 2022)'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 40,
      maxIncome: 500000,
      requiresUnorganizedWorker: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account Passbook / Account details',
      'Mobile Number linked with bank account',
      'Nominee Details (Aadhaar and date of birth)'
    ],
    applicationProcess: [
      'Visit your bank branch or use Internet/Mobile banking (SBI, PNB, HDFC, ICICI, etc.)',
      'Fill APY Subscriber Registration Form and choose monthly pension slab (₹1,000 to ₹5,000)',
      'Provide spouse and nominee details, submit auto-debit authorization',
      'Receive Permanent Retirement Account Number (PRAN) confirmation SMS'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.npscra.nsdl.co.in',
    officialSource: 'PFRDA, Ministry of Finance, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['pension', 'senior citizen', 'retirement', 'unorganized', 'social security']
  },
  {
    id: 'national-means-cum-merit-scholarship',
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    slug: 'national-means-cum-merit-scholarship',
    shortDescription: 'Scholarship of ₹12,000 per annum for meritorious students studying in Class 9 to 12 in government/aided schools.',
    description: 'Implemented by Department of School Education & Literacy to award scholarships to meritorious students of economically weaker sections to arrest dropouts at Class 8 and encourage higher secondary study.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Department of School Education & Literacy, Ministry of Education',
    financialBenefitAmount: '₹12,000 per year (₹1,000 per month) from Class 9 to 12',
    benefits: [
      '₹12,000 per annum awarded directly through DBT into student’s bank account',
      'Disbursed every year for 4 consecutive years (Classes 9, 10, 11, and 12)'
    ],
    eligibility: [
      'Students studying in regular state/central government, government-aided, and local body schools',
      'Must have passed Class 7 with minimum 55% marks (50% for SC/ST)',
      'Annual parental income from all sources must not exceed ₹3.5 Lakhs',
      'Must qualify the State Level NMMSS Selection Examination (Mental Ability & Scholastic Aptitude)'
    ],
    eligibilityRules: {
      minAge: 12,
      maxAge: 18,
      maxIncome: 350000,
      requiresStudent: true,
      minEducation: ['Below 10th']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Class 7th / 8th Marksheet',
      'Income Certificate (Family income < ₹3.5 Lakhs)',
      'Caste / Category Certificate (if SC/ST/OBC/Disability)',
      'School Bonafide Certificate from Principal',
      'Bank Account Passbook in Student’s Name'
    ],
    applicationProcess: [
      'Appear and qualify the State Level NMMSS Examination conducted by SCERT / State Education Board in Class 8',
      'After qualifying, register and apply online on the National Scholarship Portal (scholarships.gov.in)',
      'Upload verified documents and submit for School Nodal Officer verification',
      'State Nodal Officer approves application for DBT disbursement'
    ],
    deadline: '25 October 2026',
    deadlineDate: '2026-10-25',
    isDeadlineApproaching: true,
    officialWebsite: 'https://scholarships.gov.in',
    officialSource: 'Ministry of Education, Government of India',
    lastUpdated: 'August 2026',
    tags: ['scholarship', 'school', 'class 9', 'class 10', 'means merit', 'education']
  },
  {
    id: 'post-matric-scholarship-sc-st',
    name: 'Centrally Sponsored Post-Matric Scholarship for SC and ST Students',
    slug: 'post-matric-scholarship-sc-st',
    shortDescription: 'Full tuition fee waiver, maintenance allowance, and academic support for SC/ST students in Class 11, 12, Diploma, UG, and PG.',
    description: 'A major welfare scholarship empowering Scheduled Caste (SC) and Scheduled Tribe (ST) students to complete their post-matriculation or post-secondary education through comprehensive financial coverage.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Ministry of Social Justice and Empowerment & Ministry of Tribal Affairs',
    financialBenefitAmount: 'Full non-refundable tuition fees + up to ₹13,500/year maintenance allowance',
    benefits: [
      '100% compulsory non-refundable tuition and examination fees paid directly to the institute',
      'Annual maintenance allowance up to ₹13,500 for hostellers and ₹7,000 for day scholars',
      'Additional disability allowances, study tour charges, and thesis typing support'
    ],
    eligibility: [
      'Belonging to Scheduled Caste (SC) or Scheduled Tribe (ST) community',
      'Must have passed Matriculation (Class 10) or Higher Secondary',
      'Pursuing post-matriculation or post-secondary courses in recognized institutions',
      'Total annual family income must not exceed ₹2.5 Lakhs per annum'
    ],
    eligibilityRules: {
      minAge: 15,
      maxAge: 35,
      categories: ['SC', 'ST'],
      maxIncome: 250000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card of the Student',
      'Permanent Caste Certificate issued by competent revenue authority',
      'Income Certificate (under ₹2.5 Lakhs)',
      '10th / 12th / Previous Year Marksheets',
      'College Fee Structure & Admission Receipt',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    applicationProcess: [
      'Apply online through National Scholarship Portal (scholarships.gov.in) or State Welfare Portals (e.g., ePASS / MahaDBT)',
      'Fill post-matric scholarship registration form with caste certificate number',
      'Institute verifies admission, attendance, and fee details online',
      'Central and State DBT funding share credited directly to bank account'
    ],
    deadline: '30 November 2026',
    deadlineDate: '2026-11-30',
    isDeadlineApproaching: false,
    officialWebsite: 'https://scholarships.gov.in',
    officialSource: 'Ministry of Social Justice & Ministry of Tribal Affairs',
    lastUpdated: 'August 2026',
    tags: ['sc', 'st', 'post matric', 'scholarship', 'tuition fee', 'college']
  },
  {
    id: 'pm-awas-yojana-gramin',
    name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    slug: 'pm-awas-yojana-gramin',
    shortDescription: 'Financial assistance of ₹1.20 Lakh to ₹1.30 Lakh to construct a pucca house with toilet, electricity, and clean cooking connection in rural areas.',
    description: 'PMAY-G aims to provide pucca houses with basic amenities to all homeless households and families living in kutcha and dilapidated houses in rural areas.',
    category: 'Housing',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Ministry of Rural Development',
    financialBenefitAmount: '₹1,20,000 (Plain areas) / ₹1,30,000 (Hilly/NE/Difficult areas) + 90 days MGNREGA wages',
    benefits: [
      'Direct financial grant of ₹1.20 Lakh in plain areas and ₹1.30 Lakh in hilly/difficult/IAP districts',
      'Additional ₹12,000 for toilet construction under Swachh Bharat Mission (SBM)',
      '90-95 person-days of unskilled labor wages under MGNREGA (~₹25,000)',
      'LPG connection under PM Ujjwala Yojana & LED electricity connection under Saubhagya'
    ],
    eligibility: [
      'Rural households with no shelter, living in 0, 1, or 2 room kutcha houses with kutcha roof and wall',
      'Beneficiaries selected through Socio-Economic and Caste Census (SECC) 2011 & Awaas+ survey list validated by Gram Sabha',
      'Households without motorized two/three/four wheeler, mechanized fishing boat, or agricultural equipment'
    ],
    eligibilityRules: {
      minAge: 18,
      areaType: 'Rural',
      maxIncome: 300000
    },
    requiredDocuments: [
      'Aadhaar Card of all family members',
      'Bank Account Passbook (Aadhaar linked)',
      'MGNREGA Job Card Number',
      'Consent letter to use Aadhaar on beneficiary’s behalf',
      'Gram Panchayat / Gram Sabha verification certificate'
    ],
    applicationProcess: [
      'Beneficiaries are registered on AwaasSoft portal through Gram Panchayat or Block Development Office',
      'Geo-tagging of existing kutcha house done by Gram Rozgar Sahayak',
      'Sanction order issued and 1st installment transferred via DBT for foundation work',
      'Subsequent installments released after physical verification and geo-tagging at plinth, lintel, and roof levels'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://pmayg.nic.in',
    officialSource: 'Ministry of Rural Development, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['housing', 'rural', 'pucca house', 'pmay', 'gramin', 'bpl']
  },
  {
    id: 'pm-svanidhi-scheme',
    name: 'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    slug: 'pm-svanidhi-scheme',
    shortDescription: 'Affordable collateral-free working capital loan starting from ₹10,000 up to ₹50,000 with 7% interest subsidy and cashback for street vendors.',
    description: 'PM SVANidhi is a Central Sector micro-credit scheme launched to empower urban, peri-urban, and rural street vendors to restart and scale their livelihoods.',
    category: 'Employment',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Ministry of Housing and Urban Affairs (MoHUA)',
    financialBenefitAmount: 'Graduated collateral-free loans: ₹10k (1st), ₹20k (2nd), ₹50k (3rd) + 7% interest subsidy',
    benefits: [
      '1st loan: up to ₹10,000; 2nd loan: up to ₹20,000; 3rd loan: up to ₹50,000 on timely repayment',
      '7% interest subsidy credited directly to bank account on quarterly basis',
      'Cashback up to ₹1,200/year (₹100/month) for digital transactions via UPI QR code'
    ],
    eligibility: [
      'Street vendors and hawkers engaged in vending in urban areas on or before March 24, 2020 (or identified in ULB surveys)',
      'Possessing Certificate of Vending (CoV) / ID card issued by Urban Local Body (ULB) or Letter of Recommendation (LoR)'
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 70,
      requiresStreetVendor: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Vending Certificate / Identity Card / Letter of Recommendation from ULB/Town Vending Committee',
      'Bank Account Passbook (Aadhaar linked)',
      'Active Mobile number linked with Aadhaar'
    ],
    applicationProcess: [
      'Apply online at pmsvanidhi.mohua.gov.in or PM SVANidhi mobile app',
      'Verify mobile OTP and Aadhaar authentication',
      'Provide Certificate of Vending or apply for Letter of Recommendation (LoR)',
      'Select preferred lending institution / bank for loan disbursement'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://pmsvanidhi.mohua.gov.in',
    officialSource: 'Ministry of Housing and Urban Affairs, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['street vendor', 'micro credit', 'loan', 'urban', 'interest subsidy']
  },
  {
    id: 'stand-up-india-scheme',
    name: 'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
    slug: 'stand-up-india-scheme',
    shortDescription: 'Bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for greenfield enterprises.',
    description: 'Launched to promote entrepreneurship among women and SC/ST communities for setting up greenfield enterprises in manufacturing, services, agri-allied activities, or trading sectors.',
    category: 'Business',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Department of Financial Services, Ministry of Finance',
    financialBenefitAmount: 'Bank loan from ₹10 Lakhs up to ₹1 Crore for greenfield projects',
    benefits: [
      'Composite loan (term loan and working capital) between ₹10 Lakhs and ₹1 Crore',
      'Covers up to 85% of total project cost',
      'Pre-loan handholding support through SIDBI and NABARD'
    ],
    eligibility: [
      'SC/ST and/or Woman entrepreneurs above 18 years of age',
      'Loans under the scheme are available only for Greenfield projects (first time venture)',
      'In case of non-individual enterprises, at least 51% shareholding and controlling stake held by SC/ST or woman entrepreneur'
    ],
    eligibilityRules: {
      minAge: 18,
      categories: ['SC', 'ST'],
      requiresWomanEntrepreneur: true,
      requiresBusinessOwner: true
    },
    requiredDocuments: [
      'Aadhaar Card and PAN Card',
      'Caste Certificate (for SC/ST applicants)',
      'Detailed Project Report (DPR) / Greenfield Business Plan',
      'Proof of Business Premises / Lease / Rent agreement',
      'Past 3 years ITR & Bank statements (if existing)',
      'Company Incorporation / Partnership Deed (if applicable)'
    ],
    applicationProcess: [
      'Visit the official Stand-Up India Portal at standupmitra.in',
      'Register as "Trainee" (for handholding) or "Ready Borrower"',
      'Complete loan application form and upload Project Report',
      'Application routed to designated bank branch for appraisal and sanction'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.standupmitra.in',
    officialSource: 'SIDBI & Department of Financial Services, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['women entrepreneur', 'sc', 'st', 'business loan', 'greenfield', 'startup']
  },
  {
    id: 'national-overseas-scholarship',
    name: 'National Overseas Scholarship for SC, De-notified Tribes, and Landless Agricultural Labourers',
    slug: 'national-overseas-scholarship',
    shortDescription: 'Full financial support covering tuition fees, maintenance, and travel for master’s and PhD studies in top 500 QS world ranked universities.',
    description: 'Provides financial assistance to selected low-income SC, De-notified Nomadic and Semi-Nomadic Tribes, Traditional Artisans, and Landless Agricultural Labourers students to pursue Master’s degree and Ph.D. abroad.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Ministry of Social Justice and Empowerment',
    financialBenefitAmount: '100% Tuition Fees + Annual Maintenance ($15,400 / £9,900) + Airfare + Visa fees',
    benefits: [
      'Complete tuition and examination fees paid directly to the foreign university',
      'Annual maintenance allowance: USD 15,400 for USA and other countries; GBP 9,900 for UK',
      'Economy class air travel tickets, health insurance, visa fees, and contingency allowances'
    ],
    eligibility: [
      'Belonging to SC / DNT / Landless Agricultural Labourer families',
      'Must have secured unconditional admission in top 500 QS World Ranked foreign university',
      'Minimum 60% marks or equivalent in qualifying Bachelor’s or Master’s degree',
      'Total annual family income must not exceed ₹8.0 Lakhs per annum',
      'Age below 35 years as on 1st April of the selection year'
    ],
    eligibilityRules: {
      minAge: 20,
      maxAge: 35,
      categories: ['SC'],
      maxIncome: 800000,
      minEducation: ['Undergraduate (UG)', 'Postgraduate (PG)']
    },
    requiredDocuments: [
      'Aadhaar Card & Passport',
      'Valid SC / DNT / Category Certificate',
      'Income Certificate (Annual family income < ₹8 Lakhs)',
      'Unconditional Offer Letter from Top 500 QS Ranked University',
      'Graduation / Post-Graduation Degree and Official Transcripts (min 60%)',
      'Two Academic Reference letters'
    ],
    applicationProcess: [
      'Apply online on the portal: nosmsje.gov.in',
      'Register, create user ID, and fill applicant personal & academic profiles',
      'Upload verified admission letter, QS ranking proof, passport, and certificates',
      'Selection done by Screening & Selection Committee of Ministry of Social Justice'
    ],
    deadline: '15 September 2026',
    deadlineDate: '2026-09-15',
    isDeadlineApproaching: true,
    officialWebsite: 'https://nosmsje.gov.in',
    officialSource: 'Ministry of Social Justice and Empowerment',
    lastUpdated: 'August 2026',
    tags: ['abroad scholarship', 'masters', 'phd', 'sc', 'higher education', 'overseas']
  },
  {
    id: 'telangana-rythu-bandhu',
    name: 'Telangana Rythu Bharosa / Rythu Bandhu Farmer Investment Support',
    slug: 'telangana-rythu-bandhu',
    shortDescription: 'Direct investment support of ₹15,000 per acre per year for all landholding farmers in Telangana for Kharif and Rabi crops.',
    description: 'Flagship agriculture investment support initiative by the Government of Telangana providing financial grant per acre per season directly to farmers to procure seeds, fertilizers, and field operations.',
    category: 'Agriculture',
    state: 'Telangana',
    governmentLevel: 'State',
    department: 'Department of Agriculture, Government of Telangana',
    financialBenefitAmount: '₹15,000 per acre per year (₹7,500 per season)',
    benefits: [
      'Direct Benefit Transfer of ₹7,500 per acre for Kharif season and ₹7,500 per acre for Rabi season',
      'Freedom from non-institutional moneylenders and debt traps for crop input expenses',
      'No land ceiling for genuine cultivating pattadar farmers'
    ],
    eligibility: [
      'Must be a resident farmer of Telangana possessing agricultural land',
      'Must have electronic Pattadar Passbook (Dharani Portal record)',
      'All land titles updated in the state revenue records'
    ],
    eligibilityRules: {
      minAge: 18,
      states: ['Telangana'],
      requiresFarmer: true
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Telangana Dharani Pattadar Passbook',
      'Aadhaar-seeded Bank Account in Telangana',
      'Mobile number linked to Dharani portal'
    ],
    applicationProcess: [
      'Ensure Pattadar Passbook and land title are verified on Dharani portal (dharani.telangana.gov.in)',
      'Submit bank account details and Aadhaar to Agriculture Extension Officer (AEO)',
      'Funds directly deposited into bank account before the start of sowing season'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://dharani.telangana.gov.in',
    officialSource: 'Government of Telangana, Department of Agriculture',
    lastUpdated: 'August 2026',
    tags: ['telangana', 'farmer', 'agriculture', 'rythu bharosa', 'state scheme']
  },
  {
    id: 'centrally-sponsored-post-matric-obc',
    name: 'Centrally Sponsored Post-Matric Scholarship for OBC / EBC Students',
    slug: 'centrally-sponsored-post-matric-obc',
    shortDescription: 'Full tuition fee waiver, maintenance allowances, and academic incentives for OBC and EBC students pursuing post-matric studies.',
    description: 'A flagship scholarship under the Ministry of Social Justice and Empowerment offering financial support to Other Backward Classes (OBC), Economically Backward Classes (EBC), and De-notified Tribes (DNT) students pursuing Class 11, 12, ITI, Polytechnic, Degree, PG, and Professional courses.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment',
    financialBenefitAmount: 'Full non-refundable institutional fee waiver + up to ₹12,000/year maintenance allowance',
    benefits: [
      '100% compulsory non-refundable tuition and examination fee reimbursement',
      'Annual maintenance allowance for hostellers (up to ₹12,000) and day scholars (up to ₹6,000)',
      'Study tour allowances, thesis typing charges, and disability support'
    ],
    eligibility: [
      'Citizen of India belonging to Other Backward Class (OBC), EBC, or DNT category',
      'Enrolled in recognized post-matric / post-secondary education (Intermediate, Degree, Diploma, PG, Professional)',
      'Total annual family income must not exceed ₹2.5 Lakhs per annum',
      'Must not be availing any other government scholarship'
    ],
    eligibilityRules: {
      minAge: 15,
      maxAge: 35,
      categories: ['OBC', 'EWS'],
      maxIncome: 250000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card of the student',
      'Valid OBC / Non-Creamy Layer (NCL) Certificate issued by competent Tahsildar / Revenue Authority',
      'Income Certificate (under ₹2.5 Lakhs)',
      'Previous examination mark sheets (SSC / 10th / Intermediate)',
      'College Bonafide Certificate & Admission Fee Receipt',
      'Aadhaar-seeded Bank Account details'
    ],
    applicationProcess: [
      'Apply online on the National Scholarship Portal (scholarships.gov.in) or state scholarship portal',
      'Register using Aadhaar number and fill academic and caste details',
      'Submit institutional verification form to college nodal officer',
      'State welfare department validates and disburses DBT funds directly into bank account'
    ],
    deadline: '30 November 2026',
    deadlineDate: '2026-11-30',
    isDeadlineApproaching: false,
    officialWebsite: 'https://scholarships.gov.in',
    officialSource: 'Ministry of Social Justice and Empowerment, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['obc', 'ebc', 'post matric', 'scholarship', 'tuition fee', 'nsp', 'college', 'student']
  },
  {
    id: 'pm-vidyalaxmi-scheme',
    name: 'PM Vidyalaxmi Scheme & Central Sector Interest Subsidy (CSIS)',
    slug: 'pm-vidyalaxmi-scheme',
    shortDescription: 'Collateral-free higher education loans up to ₹10 Lakhs with 100% full interest subsidy during course study for students with family income up to ₹8 Lakhs.',
    description: 'The PM Vidyalaxmi scheme is the central government initiative to ensure that no meritorious student is denied higher professional/technical education due to financial constraints. Provides collateral-free, guarantor-free education loans from scheduled banks with complete government interest subsidy during the moratorium period (course duration + 1 year) for families with income up to ₹8 Lakhs per annum.',
    category: 'Scholarships',
    state: 'All India',
    governmentLevel: 'Central',
    department: 'Department of Higher Education, Ministry of Education, Government of India',
    financialBenefitAmount: 'Up to ₹10 Lakhs collateral-free loan + 100% full interest subsidy during course study',
    benefits: [
      '100% full interest subsidy covered by the Central Government during moratorium period (Course + 1 year)',
      'No collateral or third-party guarantee required for loans up to ₹7.5 Lakhs and ₹10 Lakhs',
      'Single window digital platform to apply and track loans across 40+ scheduled banks'
    ],
    eligibility: [
      'Indian national student admitted to approved professional / technical courses in recognized higher education institutions in India',
      'Annual gross family income from all sources must not exceed ₹8.0 Lakhs per annum',
      'Course must be approved by AICTE, UGC, or relevant statutory body',
      'Must apply through the official PM Vidyalaxmi portal'
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 35,
      maxIncome: 800000,
      requiresStudent: true
    },
    requiredDocuments: [
      'Aadhaar Card and PAN Card of student and co-borrower parent',
      'Admission Letter / Proof of Admission to approved higher education course',
      'Income Certificate issued by designated state revenue authority (under ₹8 Lakhs)',
      '10th, 12th, and Degree Marksheets',
      'Fee Structure schedule issued by College / University',
      'Bank Account details of applicant'
    ],
    applicationProcess: [
      'Visit the official PM Vidyalaxmi / Vidya Lakshmi portal (vidyalakshmi.co.in)',
      'Register and complete Common Education Loan Application Form (CELAF)',
      'Search and select preferred bank schemes for interest subsidy',
      'Upload verified admission letter, fee structure, and income certificate for bank approval'
    ],
    deadline: 'Open Year Round',
    deadlineDate: '2026-12-31',
    isDeadlineApproaching: false,
    officialWebsite: 'https://www.vidyalakshmi.co.in',
    officialSource: 'Department of Higher Education, Ministry of Education, Govt of India',
    lastUpdated: 'August 2026',
    tags: ['education loan', 'interest subsidy', 'vidyalaxmi', 'higher education', 'college', 'technical']
  }
];

export const SCHEMES_DATABASE: Scheme[] = [...BASE_SCHEMES, ...STATE_SCHEMES];

