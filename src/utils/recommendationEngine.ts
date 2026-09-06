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
    if (allowedStates.includes(state)) {
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
      unmetCriteria.push(`Applicable in ${allowedStates.join(', ')} only (Your state: ${state})`);
      reasons.push({
        matched: false,
        criterion: 'State Domicile',
        detail: `Available exclusively for residents of ${allowedStates.join(', ')}.`
      });
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

  // 7. Farmer status
  if (rules.requiresFarmer) {
    totalFactors += 3;
    if (profile.isFarmer || employmentStatus === 'Farmer' || occupation.toLowerCase().includes('farmer') || occupation.toLowerCase().includes('agri')) {
      matchedFactors += 3;
      reasons.push({
        matched: true,
        criterion: 'Agricultural Profile',
        detail: 'You are identified as a farmer / agricultural landholder.'
      });
    } else {
      unmetCriteria.push('Requires landholding farmer or agricultural status');
      reasons.push({
        matched: false,
        criterion: 'Agricultural Profile',
        detail: 'Applicant must be an agricultural cultivator or landholder.'
      });
    }
  }

  // 8. Woman Entrepreneur
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

  // 9. Area Type (Rural / Urban)
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

  // 10. Marital Status
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
