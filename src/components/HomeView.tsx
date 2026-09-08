import React, { useMemo, useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  Landmark, 
  Building, 
  MapPin, 
  X,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEMES_DATABASE } from '../data/schemes';
import { STATE_DISTRICT_MAP } from '../data/statesAndDistricts';
import { Scheme, UserProfile } from '../types';
import { evaluateSchemeEligibility, matchSchemesFromAiResponse } from '../utils/recommendationEngine';
import { AiTextResponsePanel } from './AiTextResponsePanel';

interface HomeViewProps {
  onSelectScheme: (scheme: Scheme) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectScheme }) => {
  const { 
    currentUser, 
    openAuthModal,
    isAskingStateSchemes,
    askChatbotForStateSchemes,
    stateChatbotAnswer,
    isAskingCentralSchemes,
    askChatbotForCentralSchemes,
    centralChatbotAnswer,
    searchQuery
  } = useApp();

  const [stateAiReply, setStateAiReply] = useState<string>('');
  const [centralAiReply, setCentralAiReply] = useState<string>('');

  // Active state selection for state government schemes:
  // When logged in, strictly locked to currentUser.state.
  // When guest, defaults to Telangana or selected state.
  const [selectedState, setSelectedState] = useState<string>(currentUser?.state || 'Telangana');

  useEffect(() => {
    if (currentUser?.state) {
      setSelectedState(currentUser.state);
    }
  }, [currentUser?.state]);

  const activeStateName = currentUser?.state || selectedState || 'Telangana';

  const allStates = useMemo(() => {
    return Object.keys(STATE_DISTRICT_MAP).sort();
  }, []);

  // Effective user profile to ensure no schemes are out of user details
  const effectiveProfile: UserProfile = useMemo(() => {
    if (currentUser) {
      return currentUser;
    }
    // Baseline profile for evaluation when guest
    return {
      id: 'guest-profile',
      email: 'guest@yojanamitra.gov.in',
      name: 'Citizen',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
      age: 21,
      gender: 'male',
      state: activeStateName,
      district: 'Hyderabad',
      areaType: 'Urban',
      maritalStatus: 'Single',
      highestEducation: 'Undergraduate (UG)',
      currentEducationStatus: 'Pursuing',
      isStudent: true,
      category: 'OBC',
      isDisability: false,
      isMinority: false,
      annualFamilyIncome: 250000,
      employmentStatus: 'Student',
      occupation: 'Student',
      isFarmer: false,
      isBusinessOwner: false,
      isWomanEntrepreneur: false,
      isSeniorCitizen: false,
      isBPLOrEWS: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [currentUser, activeStateName]);

  // Helper function to deduplicate schemes strictly
  const deduplicateSchemes = (list: Scheme[]): Scheme[] => {
    const seen = new Set<string>();
    return list.filter(scheme => {
      if (!scheme || !scheme.id) return false;
      if (seen.has(scheme.id)) return false;
      seen.add(scheme.id);
      return true;
    });
  };

  // -------------------------------------------------------------------
  // 1. STATE SCHEMES DATA (ONLY SHOWN WHEN USER TAPS ASK AI)
  // -------------------------------------------------------------------
  const [stateAiQueried, setStateAiQueried] = useState<boolean>(false);
  const [stateAiSchemes, setStateAiSchemes] = useState<Scheme[]>([]);

  // Eligible pool of state schemes for active state matching user profile
  const eligibleStatePool = useMemo(() => {
    const list = SCHEMES_DATABASE.filter(s => {
      const stateMatch = s.state.toLowerCase() === activeStateName.toLowerCase() ||
        (s.eligibilityRules?.states?.some(st => st.toLowerCase() === activeStateName.toLowerCase()) ?? false);
      if (!stateMatch) return false;

      // Strictly verify no schemes are out of user details
      const evalRes = evaluateSchemeEligibility(s, effectiveProfile);
      return evalRes.unmetCriteria.length === 0;
    });

    return deduplicateSchemes(list);
  }, [activeStateName, effectiveProfile]);

  // Handle Ask AI for State Schemes
  const handleAskStateAi = async () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    setStateAiQueried(true);
    const result = await askChatbotForStateSchemes(activeStateName);
    if (result && result.reply) {
      setStateAiReply(result.reply);
    }
    if (result.foundSchemes && result.foundSchemes.length > 0) {
      // Strictly enforce user details & deduplicate live chatbot given schemes
      const strictlyEligible = result.foundSchemes.filter(s => {
        const evalRes = evaluateSchemeEligibility(s, effectiveProfile);
        return evalRes.unmetCriteria.length === 0;
      });
      setStateAiSchemes(deduplicateSchemes(strictlyEligible));
    } else {
      // Extract mentioned schemes from live response strictly adhering to user details
      const matched = matchSchemesFromAiResponse(result.reply, eligibleStatePool, effectiveProfile);
      setStateAiSchemes(deduplicateSchemes(matched));
    }
  };

  // Active state schemes to show (EMPTY unless stateAiQueried is true)
  const activeStateSchemes = useMemo(() => {
    if (!stateAiQueried) return [];
    if (!searchQuery.trim()) return stateAiSchemes;
    const q = searchQuery.toLowerCase().trim();
    return stateAiSchemes.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [stateAiQueried, stateAiSchemes, searchQuery]);

  // -------------------------------------------------------------------
  // 2. CENTRAL SCHEMES DATA (ONLY SHOWN WHEN USER TAPS ASK AI)
  // -------------------------------------------------------------------
  const [centralAiQueried, setCentralAiQueried] = useState<boolean>(false);
  const [centralAiSchemes, setCentralAiSchemes] = useState<Scheme[]>([]);

  // Eligible pool of central schemes matching user profile
  const eligibleCentralPool = useMemo(() => {
    const list = SCHEMES_DATABASE.filter(s => {
      const isCentral = s.governmentLevel === 'Central' || s.governmentLevel === 'All India';
      if (!isCentral) return false;

      // Strictly verify no schemes are out of user details
      const evalRes = evaluateSchemeEligibility(s, effectiveProfile);
      return evalRes.unmetCriteria.length === 0;
    });

    return deduplicateSchemes(list);
  }, [effectiveProfile]);

  // Handle Ask AI for Central Schemes
  const handleAskCentralAi = async () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    setCentralAiQueried(true);
    const result = await askChatbotForCentralSchemes();
    if (result && result.reply) {
      setCentralAiReply(result.reply);
    }
    if (result.foundSchemes && result.foundSchemes.length > 0) {
      // Strictly enforce user details & deduplicate live chatbot given schemes
      const strictlyEligible = result.foundSchemes.filter(s => {
        const evalRes = evaluateSchemeEligibility(s, effectiveProfile);
        return evalRes.unmetCriteria.length === 0;
      });
      setCentralAiSchemes(deduplicateSchemes(strictlyEligible));
    } else {
      // Extract mentioned schemes from live response strictly adhering to user details
      const matched = matchSchemesFromAiResponse(result.reply, eligibleCentralPool, effectiveProfile);
      setCentralAiSchemes(deduplicateSchemes(matched));
    }
  };

  // Active central schemes to show (EMPTY unless centralAiQueried is true)
  const activeCentralSchemes = useMemo(() => {
    if (!centralAiQueried) return [];
    if (!searchQuery.trim()) return centralAiSchemes;
    const q = searchQuery.toLowerCase().trim();
    return centralAiSchemes.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [centralAiQueried, centralAiSchemes, searchQuery]);

  return (
    <div className="space-y-10 pb-16">

      {/* ==================================================== */}
      {/* SECTION 1: STATE SCHEMES                            */}
      {/* ==================================================== */}
      <section className="space-y-4">
        
        {/* State Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-amber-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                <Landmark className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                {activeStateName} State Schemes
              </h2>
            </div>
            <p className="text-xs text-stone-600">
              State welfare initiatives and scholarships enacted by the <strong>Government of {activeStateName}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* State Domicile Indicator:
                AFTER LOGIN: Option of choosing state is completely deleted; locked to currentUser.state.
                BEFORE LOGIN: Guest users can select state. */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 border border-amber-300 rounded-xl text-xs shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span className="font-semibold text-stone-600 text-[11px]">State Domicile:</span>
                <span className="font-bold text-amber-950 text-xs">{currentUser.state}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-semibold text-stone-600 text-[11px]">State:</span>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setStateAiQueried(false);
                    setStateAiSchemes([]);
                  }}
                  className="bg-transparent font-bold text-amber-950 text-xs focus:outline-none cursor-pointer pr-1"
                >
                  {allStates.map(st => (
                    <option key={st} value={st} className="text-stone-900">
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Ask AI for State Schemes Button */}
            <button
              onClick={handleAskStateAi}
              disabled={isAskingStateSchemes}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
              title={`Click to ask AI for verified ${activeStateName} schemes`}
            >
              {isAskingStateSchemes ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{isAskingStateSchemes ? `Scanning ${activeStateName}...` : `Ask AI for ${activeStateName} Schemes`}</span>
            </button>
          </div>
        </div>

        {/* CONDITION: ONLY SHOW SCHEMES IF USER TAPS ASK AI */}
        {!stateAiQueried && !stateChatbotAnswer ? (
          <div className="bg-amber-50/40 border border-dashed border-amber-300 rounded-2xl p-8 sm:p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center shadow-2xs">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-sm font-bold text-stone-900">
                Discover Government of {activeStateName} Schemes
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tap <strong>Ask AI for {activeStateName} Schemes</strong> to run a live evaluation tailored strictly to your profile details with official portal verification.
              </p>
            </div>
            <button
              onClick={handleAskStateAi}
              disabled={isAskingStateSchemes}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isAskingStateSchemes ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{isAskingStateSchemes ? `Evaluating ${activeStateName}...` : `Ask AI for ${activeStateName} Schemes`}</span>
            </button>
          </div>
        ) : isAskingStateSchemes ? (
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-8 text-center space-y-3">
            <Loader2 className="w-7 h-7 animate-spin text-amber-700 mx-auto" />
            <p className="text-xs font-bold text-amber-950">
              Live chatbot is evaluating Government of {activeStateName} schemes for your details...
            </p>
          </div>
        ) : (
          <AiTextResponsePanel
            title={`Government of ${activeStateName} Schemes & Scholarships`}
            subtitle={`AI Verified active state welfare initiatives matching your personal details`}
            response={stateChatbotAnswer?.text || stateAiReply || `No specific state schemes found for ${activeStateName} matching your current profile.`}
            timestamp={stateChatbotAnswer?.timestamp}
            theme="amber"
            stateName={activeStateName}
            relevantSchemes={stateAiSchemes.length > 0 ? stateAiSchemes : eligibleStatePool}
            discussPrompt={`Tell me more about active state welfare schemes and scholarships in ${activeStateName} for my profile.`}
            onClear={() => {
              setStateAiQueried(false);
              setStateAiReply('');
              setStateAiSchemes([]);
            }}
          />
        )}

      </section>

      {/* ==================================================== */}
      {/* SECTION 2: CENTRAL SCHEMES                          */}
      {/* ==================================================== */}
      <section className="space-y-4 pt-2">
        
        {/* Central Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-emerald-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900">
                <Building className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                Central Government Schemes
              </h2>
            </div>
            <p className="text-xs text-stone-600">
              National flagship welfare programs, Central Sector scholarships, and DBT initiatives.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold">
              🇮🇳 Pan-India
            </span>

            {/* Ask AI for Central Schemes Button */}
            <button
              onClick={handleAskCentralAi}
              disabled={isAskingCentralSchemes}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Click to ask AI for verified Central government schemes"
            >
              {isAskingCentralSchemes ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isAskingCentralSchemes ? 'Evaluating Central...' : 'Ask AI for Central Schemes'}</span>
            </button>
          </div>
        </div>

        {/* CONDITION: ONLY SHOW CENTRAL RESPONSE IF USER TAPS ASK AI OR HAS ANSWER */}
        {!centralAiQueried && !centralChatbotAnswer ? (
          <div className="bg-emerald-50/40 border border-dashed border-emerald-300 rounded-2xl p-8 sm:p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 mx-auto flex items-center justify-center shadow-2xs">
              <Building className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-sm font-bold text-stone-900">
                Discover Pan-India Central Government Schemes
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tap <strong>Ask AI for Central Schemes</strong> to run a live evaluation for national welfare and scholarship programs tailored strictly to your profile details with official portal verification.
              </p>
            </div>
            <button
              onClick={handleAskCentralAi}
              disabled={isAskingCentralSchemes}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isAskingCentralSchemes ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isAskingCentralSchemes ? 'Evaluating Central...' : 'Ask AI for Central Schemes'}</span>
            </button>
          </div>
        ) : isAskingCentralSchemes ? (
          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-8 text-center space-y-3">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-800 mx-auto" />
            <p className="text-xs font-bold text-emerald-950">
              Live chatbot is evaluating Pan-India Central Government schemes for your details...
            </p>
          </div>
        ) : (
          <AiTextResponsePanel
            title="Pan-India Central Government Schemes & Scholarships"
            subtitle="AI Verified flagship central welfare programs and scholarships matching your profile credentials"
            response={centralChatbotAnswer?.text || centralAiReply || 'No central schemes currently match your specific profile criteria in the chatbot evaluation.'}
            timestamp={centralChatbotAnswer?.timestamp}
            theme="emerald"
            relevantSchemes={centralAiSchemes.length > 0 ? centralAiSchemes : eligibleCentralPool}
            discussPrompt="Tell me more about Central Government schemes and national scholarships I qualify for."
            onClear={() => {
              setCentralAiQueried(false);
              setCentralAiReply('');
              setCentralAiSchemes([]);
            }}
          />
        )}

      </section>

    </div>
  );
};
