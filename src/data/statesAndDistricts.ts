export interface StateDistrictMapping {
  state: string;
  districts: string[];
}

export const STATE_DISTRICT_MAP: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 
    'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 
    'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 
    'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 
    'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial', 
    'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 
    'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 
    'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 
    'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 
    'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet', 
    'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
  ]
};

export const ALL_INDIAN_STATES: string[] = Object.keys(STATE_DISTRICT_MAP).sort((a, b) => 
  a.localeCompare(b)
);

/**
 * Returns the list of official districts for a given Indian State or Union Territory.
 * If not matched directly, returns an empty array.
 */
export function getDistrictsForState(stateName: string): string[] {
  if (!stateName) return [];
  
  // Direct match
  if (STATE_DISTRICT_MAP[stateName]) {
    return STATE_DISTRICT_MAP[stateName];
  }

  // Case-insensitive lookup
  const normalized = stateName.trim().toLowerCase();
  const matchedKey = Object.keys(STATE_DISTRICT_MAP).find(
    k => k.toLowerCase() === normalized
  );

  return matchedKey ? STATE_DISTRICT_MAP[matchedKey] : [];
}
