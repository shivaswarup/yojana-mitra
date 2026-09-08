import { Scheme, UserProfile, SchemeRecommendation, MatchReason } from '../types';

export function evaluateSchemeEligibility(scheme: Scheme, profile: UserProfile): SchemeRecommendation {
  const rules = scheme.eligibilityRules || {};
  const reasons: MatchReason[] = [];
  const unmetCriteria: string[] = [];

  const age = typeof profile.age === 'number' ? profile.age : 21;
  const gender = profile.gender || 'male';
  const state = profile.state || 'All India';
  const category = profile.category || 'General';
  const annualIncome = typeof profile.annualFamilyIncome === 'number' ? profile.annualFamilyIncome : 250000;
  const occupation = profile.occupation || '';
  const employmentStatus = profile.employmentStatus || '';
  const areaType = profile.areaType || 'Urban';
  const maritalStatus = profile.maritalStatus || 'Single';

  let totalFactors = 0;
  let matchedFactors = 0;

  // 1. Age verification
  if (rules.minAge !== undefined || rules.maxAge !== undefined) {
    totalFactors += 2;
    const min = rules.minAge ?? 0;
    const max = rules.maxAge ?? 120;
    if (age >= min && age <= max) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Age Requirement',
        detail: `Your age (${age} years) falls within the required range of ${min}–${max} years.`
      });
    } else {
      unmetCriteria.push(`Requires age between ${min} and ${max} years (You are ${age})`);
      reasons.push({
        matched: false,
        criterion: 'Age Requirement',
        detail: `Age requirement is ${min}–${max} years, but your profile indicates ${age} years.`
      });
    }
  }

  // 2. Gender check
  if (rules.genders && rules.genders.length > 0 && !rules.genders.includes('all')) {
    totalFactors += 2;
    if (rules.genders.includes(gender) || rules.genders.includes('all')) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Gender Criteria',
        detail: `Scheme is tailored for ${rules.genders.join(', ')} applicants (Your profile: ${gender}).`
      });
    } else {
      unmetCriteria.push(`Restricted to ${rules.genders.join(', ')} applicants`);
      reasons.push({
        matched: false,
        criterion: 'Gender Criteria',
        detail: `Specifically designated for ${rules.genders.join(', ')} candidates.`
      });
    }
  }

  // 3. State eligibility
  const allowedStates = (rules.states && rules.states.length > 0)
    ? rules.states
    : (scheme.state && scheme.state !== 'All India' ? [scheme.state] : []);

  if (allowedStates.length > 0 && !allowedStates.includes('All India')) {
    totalFactors += 2;
    const isStateMatch = allowedStates.some(st => st.toLowerCase() === state.toLowerCase());
    if (isStateMatch) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'State Domicile',
        detail: `You reside in ${state}, which satisfies the state initiative requirement (${allowedStates.join(', ')}).`
      });
      if (scheme.governmentLevel === 'State') {
        reasons.unshift({
          matched: true,
          criterion: 'Official State Government Initiative',
          detail: `Exclusive initiative enacted by the Government of ${state} specifically for resident citizens.`
        });
      }
    } else {
      unmetCriteria.push(`Exclusively for residents of ${allowedStates.join(', ')} (Your state: ${state})`);
      reasons.push({
        matched: false,
        criterion: 'State Domicile',
        detail: `Available exclusively for residents of ${allowedStates.join(', ')}.`
      });
    }
  } else if (scheme.governmentLevel === 'State' && scheme.state && scheme.state !== 'All India') {
    if (scheme.state.toLowerCase() !== state.toLowerCase()) {
      unmetCriteria.push(`Exclusively for residents of ${scheme.state} (Your state: ${state})`);
    }
  }

  // 4. Category (SC/ST/OBC/EWS/General)
  if (rules.categories && rules.categories.length > 0) {
    totalFactors += 2;
    if (rules.categories.includes(category)) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Category / Reservation',
        detail: `Your social category (${category}) matches the scheme mandate (${rules.categories.join(', ')}).`
      });
    } else {
      unmetCriteria.push(`Designated for ${rules.categories.join(', ')} (Your category is ${category})`);
      reasons.push({
        matched: false,
        criterion: 'Category / Reservation',
        detail: `Targeted towards ${rules.categories.join(', ')} category students/citizens.`
      });
    }
  }

  // 5. Annual Income
  if (rules.maxIncome !== undefined) {
    totalFactors += 2;
    if (annualIncome <= rules.maxIncome) {
      matchedFactors += 2;
      const formattedMax = (rules.maxIncome / 100000).toFixed(1) + ' Lakhs';
      const formattedUser = (annualIncome / 100000).toFixed(1) + ' Lakhs';
      reasons.push({
        matched: true,
        criterion: 'Income Ceiling',
        detail: `Annual family income (₹${formattedUser}) is within the scheme ceiling of ₹${formattedMax}.`
      });
    } else {
      const formattedMax = (rules.maxIncome / 100000).toFixed(1) + ' Lakhs';
      unmetCriteria.push(`Requires annual income ≤ ₹${formattedMax}`);
      reasons.push({
        matched: false,
        criterion: 'Income Ceiling',
        detail: `Your declared annual income exceeds the maximum threshold of ₹${formattedMax}.`
      });
    }
  }

  // 6. Student status
  if (rules.requiresStudent) {
    totalFactors += 2;
    if (profile.isStudent || profile.currentEducationStatus === 'Pursuing') {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Active Student Status',
        detail: `You are currently enrolled as an active student (${profile.highestEducation || 'Enrolled'}).`
      });
    } else {
      unmetCriteria.push('Requires active student enrollment');
      reasons.push({
        matched: false,
        criterion: 'Active Student Status',
        detail: 'This scheme requires active enrollment in an educational institution.'
      });
    }
  }

  // 7. Farmer status & Agricultural schemes
  if (rules.requiresFarmer || scheme.category === 'Agriculture') {
    totalFactors += 3;
    if (profile.isFarmer || employmentStatus === 'Farmer' || occupation.toLowerCase().includes('farmer') || occupation.toLowerCase().includes('agri')) {
      matchedFactors += 3;
      reasons.push({
        matched: true,
        criterion: 'Agricultural Profile',
        detail: 'You are identified as a farmer / agricultural landholder.'
      });
    } else {
      unmetCriteria.push('Requires landholding farmer or agricultural cultivator status');
      reasons.push({
        matched: false,
        criterion: 'Agricultural Profile',
        detail: 'Applicant must be an agricultural cultivator or landholder.'
      });
    }
  }

  // 8. Business Owner / Enterprise Schemes (e.g. MUDRA, Udyami, Stand-Up India)
  if (rules.requiresBusinessOwner || scheme.category === 'Business') {
    totalFactors += 2;
    const isBusiness = profile.isBusinessOwner || profile.isWomanEntrepreneur || employmentStatus === 'Self-Employed / Business' || occupation.toLowerCase().includes('business') || occupation.toLowerCase().includes('shop');
    if (isBusiness) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Business / Enterprise Profile',
        detail: 'You meet the entrepreneur/business owner criteria for commercial credit.'
      });
    } else if (profile.isStudent || employmentStatus === 'Student') {
      unmetCriteria.push('Designated for commercial business owners & entrepreneurs, not active students');
      reasons.push({
        matched: false,
        criterion: 'Business Profile',
        detail: 'Designed for active micro and small business entrepreneurs.'
      });
    }
  }

  // 9. Artisan / Craftsperson schemes (e.g. PM Vishwakarma)
  if (rules.requiresArtisan || scheme.id === 'pm-vishwakarma-yojana') {
    totalFactors += 2;
    const isArtisan = profile.employmentStatus === 'Daily Wage Worker / Artisan' || occupation.toLowerCase().includes('artisan') || occupation.toLowerCase().includes('craft') || occupation.toLowerCase().includes('carpenter') || occupation.toLowerCase().includes('tailor') || occupation.toLowerCase().includes('potter');
    if (isArtisan) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Artisan / Traditional Trade Profile',
        detail: 'You work in one of the 18 recognized traditional artisan trades.'
      });
    } else {
      unmetCriteria.push('Requires traditional artisan or craftsperson working with hands and tools');
      reasons.push({
        matched: false,
        criterion: 'Artisan Profile',
        detail: 'Exclusively for traditional artisans and craftspersons.'
      });
    }
  }

  // 10. Street Vendor schemes (e.g. PM SVANidhi)
  if (rules.requiresStreetVendor || scheme.id === 'pm-svanidhi-scheme') {
    totalFactors += 2;
    const isVendor = occupation.toLowerCase().includes('vendor') || occupation.toLowerCase().includes('hawker');
    if (isVendor) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Street Vendor Profile',
        detail: 'You qualify as an urban/rural street vendor.'
      });
    } else {
      unmetCriteria.push('Requires street vendor / hawker vending certificate or recommendation');
    }
  }

  // 11. Pension / Senior Citizen schemes (e.g. Atal Pension Yojana, Old Age Pensions)
  if (rules.requiresSeniorCitizen || scheme.category === 'Pension' || scheme.id === 'atal-pension-yojana' || scheme.id === 'mukhyamantri-vridhjan-pension-bihar') {
    totalFactors += 2;
    if (profile.isSeniorCitizen || age >= 60) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Senior Citizen Pension Criterion',
        detail: 'You qualify under senior citizen social security.'
      });
    } else if (profile.isStudent || age < 25) {
      unmetCriteria.push('Designated for unorganized laborers and senior citizens, not active students');
      reasons.push({
        matched: false,
        criterion: 'Pension Scope',
        detail: 'Designed for unorganized sector wage earners nearing old age.'
      });
    }
  }

  // 12. Woman Entrepreneur
  if (rules.requiresWomanEntrepreneur) {
    totalFactors += 2;
    if (gender === 'female' && (profile.isWomanEntrepreneur || profile.isBusinessOwner)) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Woman Entrepreneurship',
        detail: 'You meet the woman entrepreneur criteria for commercial credit.'
      });
    } else if (gender === 'female') {
      matchedFactors += 1;
      reasons.push({
        matched: true,
        criterion: 'Woman Candidate',
        detail: 'You qualify as a female applicant looking to start a venture.'
      });
    } else {
      unmetCriteria.push('Requires woman entrepreneur status or SC/ST promoter');
    }
  }

  // 13. Area Type (Rural / Urban)
  if (rules.areaType && rules.areaType !== 'Both') {
    totalFactors += 1;
    if (areaType === rules.areaType) {
      matchedFactors += 1;
      reasons.push({
        matched: true,
        criterion: 'Area Location',
        detail: `Your domicile area (${areaType}) matches the ${rules.areaType} scheme scope.`
      });
    } else {
      unmetCriteria.push(`Specifically for ${rules.areaType} areas`);
    }
  }

  // 14. Marital Status
  if (rules.maritalStatuses && rules.maritalStatuses.length > 0) {
    totalFactors += 2;
    if (rules.maritalStatuses.includes(maritalStatus)) {
      matchedFactors += 2;
      reasons.push({
        matched: true,
        criterion: 'Marital Status',
        detail: `Your marital status (${maritalStatus}) satisfies the scheme criterion (${rules.maritalStatuses.join(', ')}).`
      });
    } else {
      unmetCriteria.push(`Applicable to ${rules.maritalStatuses.join(', ')} citizens (Your status: ${maritalStatus})`);
      reasons.push({
        matched: false,
        criterion: 'Marital Status',
        detail: `Designated specifically for ${rules.maritalStatuses.join(', ')} applicants.`
      });
    }
  }

  // Compute percentage
  let score = 50; // baseline discovery score
  if (totalFactors > 0) {
    score = Math.round((matchedFactors / totalFactors) * 100);
  }

  // If there are strict disqualifications (e.g. wrong gender for girl-only scheme or wrong state), cap score
  if (unmetCriteria.length > 0) {
    score = Math.min(score, 65);
    if (rules.genders && !rules.genders.includes(gender) && !rules.genders.includes('all')) {
      score = Math.min(score, 20);
    }
    if (allowedStates.length > 0 && !allowedStates.includes('All India') && !allowedStates.includes(state)) {
      score = Math.min(score, 20);
    }
  } else {
    // Perfect or near-perfect match
    score = Math.max(score, 88);
    if (score >= 95) score = 98;
    else if (score >= 90) score = 95;
  }

  let matchBadge: SchemeRecommendation['matchBadge'] = 'You may be eligible';
  if (score >= 95) {
    matchBadge = '98% Match';
  } else if (score >= 90) {
    matchBadge = '95% Match';
  } else if (score >= 80) {
    matchBadge = 'Highly Recommended';
  } else {
    matchBadge = 'You may be eligible';
  }

  return {
    scheme,
    matchScore: score,
    matchBadge,
    matchReasons: reasons,
    unmetCriteria
  };
}

export function getRecommendedSchemes(schemes: Scheme[], profile: UserProfile): SchemeRecommendation[] {
  const recommendations = schemes.map(scheme => evaluateSchemeEligibility(scheme, profile));
  
  // Strictly filter out schemes that have unmet criteria so we never recommend schemes outside user profile
  return recommendations
    .filter(rec => rec.unmetCriteria.length === 0 && rec.matchScore >= 75)
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Filter and extract ONLY the schemes identified, recommended, or discussed in the chatbot's text response.
 */
export function matchSchemesFromAiResponse(
  aiText: string,
  candidateSchemes: Scheme[],
  userProfile?: UserProfile | null
): Scheme[] {
  if (!aiText) return [];
  const textLower = aiText.toLowerCase();

  // Deduplication map
  const seenIds = new Set<string>();

  // 1. Identify schemes explicitly mentioned in the chatbot's reply text
  const mentioned = candidateSchemes.filter(scheme => {
    // If user profile is provided, strictly enforce no schemes out of user details
    if (userProfile) {
      const eligibility = evaluateSchemeEligibility(scheme, userProfile);
      if (eligibility.unmetCriteria.length > 0) {
        return false;
      }
    }

    const nameLower = scheme.name.toLowerCase();
    const nameWithoutParen = nameLower.replace(/\([^)]*\)/g, '').trim();
    
    // Check acronym in parentheses e.g. "PMSS", "BSCCS", "ePASS", "PM-JAY", "KCR Kit"
    const acronymMatch = scheme.name.match(/\(([^)]+)\)/);
    const acronym = acronymMatch ? acronymMatch[1].trim().toLowerCase() : '';

    let isMatch = false;
    if (textLower.includes(nameLower)) {
      isMatch = true;
    } else if (nameWithoutParen.length >= 6 && textLower.includes(nameWithoutParen)) {
      isMatch = true;
    } else if (acronym.length >= 3 && (textLower.includes(` ${acronym} `) || textLower.includes(`(${acronym})`) || textLower.includes(`**${acronym}**`))) {
      isMatch = true;
    } else if (scheme.slug && textLower.includes(scheme.slug.toLowerCase())) {
      isMatch = true;
    }

    if (isMatch && !seenIds.has(scheme.id)) {
      seenIds.add(scheme.id);
      return true;
    }
    return false;
  });

  if (mentioned.length > 0) {
    return mentioned;
  }

  // 2. If exact scheme names were not verbatim in the text, filter strictly to candidate schemes that match user profile
  if (userProfile) {
    const qualified = candidateSchemes
      .filter(s => {
        if (seenIds.has(s.id)) return false;
        const evalRes = evaluateSchemeEligibility(s, userProfile);
        return evalRes.unmetCriteria.length === 0;
      })
      .sort((a, b) => {
        // If student, prioritize Scholarships & Education
        if (userProfile.isStudent) {
          const aEdu = (a.category === 'Scholarships' || a.category === 'Education' || a.category === 'Student Welfare') ? 1 : 0;
          const bEdu = (b.category === 'Scholarships' || b.category === 'Education' || b.category === 'Student Welfare') ? 1 : 0;
          if (bEdu !== aEdu) return bEdu - aEdu;
        }
        return 0;
      });

    return qualified.slice(0, 6);
  }

  // 3. Fallback for unauthenticated guest: only return broad public education/welfare schemes
  return candidateSchemes.filter(s => {
    if (seenIds.has(s.id)) return false;
    // Exclude restricted categories in fallback
    if (s.category === 'Business' || s.category === 'Agriculture' || s.category === 'Pension') {
      return false;
    }
    seenIds.add(s.id);
    return true;
  }).slice(0, 4);
}
