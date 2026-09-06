import React, { useMemo, useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle, 
  ShieldAlert, 
  UserCheck,
  Building,
  RefreshCw,
  Bot,
  ExternalLink,
  Trash2,
  ArrowRight,
  Landmark,
  MessageSquare,
  MapPin,
  Building2,
  CalendarClock,
  Clock,
  AlertTriangle,
  X,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from './SchemeCard';
import { SCHEMES_DATABASE } from '../data/schemes';
import { Scheme, UserProfile } from '../types';
import { evaluateSchemeEligibility } from '../utils/recommendationEngine';

interface HomeViewProps {
  onSelectScheme: (scheme: Scheme) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectScheme }) => {
  const { 
    currentUser, 
    setIsChatbotOpen,
    openChatbotWithPrompt,
    isAskingStateSchemes,
    stateChatbotAnswer,
    askChatbotForStateSchemes,
    isAskingCentralSchemes,
    centralChatbotAnswer,
    askChatbotForCentralSchemes,
    expiringIn3DaysSchemes,
    searchQuery, 
    setSearchQuery, 
    setActiveTab 
  } = useApp();

  const userState = currentUser?.state || 'Telangana';

  // AI discovery state: DO NOT show schemes until user clicks "Ask AI"
  const [stateAiQueried, setStateAiQueried] = useState<boolean>(false);
  const [stateAiSchemes, setStateAiSchemes] = useState<Scheme[]>([]);

  const [centralAiQueried, setCentralAiQueried] = useState<boolean>(false);
  const [centralAiSchemes, setCentralAiSchemes] = useState<Scheme[]>([]);

  // Banner dismissal state for 3-day deadline alert
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  // Handle "Ask AI for State Schemes"
  const handleAskStateAi = async () => {
    setStateAiQueried(true);
    const result = await askChatbotForStateSchemes(userState);
    if (result.foundSchemes && result.foundSchemes.length > 0) {
      setStateAiSchemes(result.foundSchemes);
    } else {
      // Fallback to all state schemes for user's state without leaving anything
      const matchingState = SCHEMES_DATABASE.filter(s => {
        return s.state.toLowerCase() === userState.toLowerCase() ||
          (s.eligibilityRules?.states?.some(st => st.toLowerCase() === userState.toLowerCase()) ?? false);
      });
      setStateAiSchemes(matchingState);
    }
  };

  // Handle "Ask AI for Central Schemes"
  const handleAskCentralAi = async () => {
    setCentralAiQueried(true);
    const result = await askChatbotForCentralSchemes();
    if (result.foundSchemes && result.foundSchemes.length > 0) {
      setCentralAiSchemes(result.foundSchemes);
    } else {
      // Fallback: all eligible central schemes
      const matchingCentral = SCHEMES_DATABASE.filter(s => {
        const isCentral = s.governmentLevel === 'Central' || s.governmentLevel === 'All India';
        if (!isCentral) return false;
        if (!currentUser) return true;
        const evalRes = evaluateSchemeEligibility(s, currentUser);
        return evalRes.unmetCriteria.length === 0;
      });
      setCentralAiSchemes(matchingCentral);
    }
  };

  // Filter state schemes if user typed a search query
  const filteredStateSchemes = useMemo(() => {
    if (!searchQuery.trim()) return stateAiSchemes;
    const q = searchQuery.toLowerCase().trim();
    return stateAiSchemes.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [stateAiSchemes, searchQuery]);

  // Filter central schemes if user typed a search query
  const filteredCentralSchemes = useMemo(() => {
    if (!searchQuery.trim()) return centralAiSchemes;
    const q = searchQuery.toLowerCase().trim();
    return centralAiSchemes.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [centralAiSchemes, searchQuery]);

  return (
    <div className="space-y-8 pb-12">

      {/* ---------------------------------------------------- */}
      {/* 3-DAY DEADLINE NOTIFICATION BANNER (CRITICAL ALERT) */}
      {/* ---------------------------------------------------- */}
      {!isAlertDismissed && expiringIn3DaysSchemes.length > 0 && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border-2 border-red-300/80 rounded-2xl shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs relative mt-0.5">
                <CalendarClock className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    🚨 3 Days Left • Deadline Alert
                  </span>
                  <span className="text-xs font-semibold text-red-950">
                    Application window closing for {expiringIn3DaysSchemes.length} verified {expiringIn3DaysSchemes.length === 1 ? 'scheme' : 'schemes'}!
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed max-w-3xl">
                  Official cut-off expires in <strong>3 days or less</strong>. Complete and submit your application with verified documents on the government portal before the portal closes.
                </p>

                {/* List of Expiring Schemes */}
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {expiringIn3DaysSchemes.map(({ scheme, daysLeft, statusText }) => (
                    <div
                      key={scheme.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 border border-red-200 rounded-lg shadow-2xs hover:bg-white transition-all cursor-pointer group"
                      onClick={() => onSelectScheme(scheme)}
                    >
                      <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="text-xs font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                        {scheme.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-black">
                        {daysLeft === 0 ? 'Today!' : `${daysLeft} Days Left`}
                      </span>
                      <ArrowRight className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dismiss & View Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('deadlines')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-900 hover:text-red-950 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <span>All Deadlines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsAlertDismissed(true)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
                title="Dismiss Alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Profile Context Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">
                {currentUser?.name || 'Citizen'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {currentUser?.occupation || 'Citizen'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                State Domicile: <strong className="text-stone-900">{userState}</strong>
              </span>
              <span>•</span>
              <span>Category: <strong className="text-stone-900">{currentUser?.category || 'General'}</strong></span>
              <span>•</span>
              <span>Family Income: <strong className="text-stone-900">₹{currentUser?.annualFamilyIncome?.toLocaleString() || 'N/A'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search in AI referred schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SECTION 1 (TOP): STATE GOVERNMENT SCHEMES & SCHOLARSHIPS */}
      {/* ==================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-amber-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                <Landmark className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                State Government Schemes & Scholarships
              </h2>
            </div>
            <p className="text-stone-600 text-xs">
              Official welfare programs, higher education tuition reimbursements, and youth entitlements from the <strong>Government of {userState}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
              🏛️ {userState} Domicile
            </span>
          </div>
        </div>

        {/* CONDITION 1: USER HAS NOT CLICKED "ASK AI FOR STATE SCHEMES" YET */}
        {!stateAiQueried ? (
          <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-stone-50 border-2 border-dashed border-amber-300/90 rounded-2xl p-8 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-xs">
              <Landmark className="w-7 h-7" />
            </div>
            <div className="max-w-lg mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-stone-900">
                Discover Active Schemes & Scholarships in {userState}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Click below to have <strong>Yojana Mitra AI Chatbot</strong> scan and evaluate all official state welfare programs, fee reimbursements, and scholarships enacted by the <strong>Government of {userState}</strong> matching your profile credentials ({currentUser?.name}, {currentUser?.occupation || 'Citizen'}).
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleAskStateAi}
                disabled={isAskingStateSchemes}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 hover:shadow-lg"
              >
                <Bot className={`w-4 h-4 ${isAskingStateSchemes ? 'animate-spin' : ''}`} />
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{isAskingStateSchemes ? `Scanning Government of ${userState}...` : `✨ Ask AI for State Schemes`}</span>
              </button>
            </div>
          </div>
        ) : (
          /* CONDITION 2: SPECIAL CHATBOT BOX FOR STATE SCHEMES */
          <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-2xl border-2 border-amber-300 p-5 sm:p-6 space-y-5 shadow-sm">
            {/* Chatbot Header */}
            <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-amber-950">
                      Yojana Mitra AI Evaluation: Government of {userState}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                      Special Chatbot Box
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Verified {filteredStateSchemes.length} state-related schemes and scholarships for your profile without leaving anything.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAskStateAi}
                  disabled={isAskingStateSchemes}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  title="Re-ask AI for State Schemes"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAskingStateSchemes ? 'animate-spin' : ''}`} />
                  <span>{isAskingStateSchemes ? 'Re-scanning...' : 'Re-ask AI'}</span>
                </button>
                <button
                  onClick={() => openChatbotWithPrompt(`Tell me more about state schemes in ${userState} and step-by-step application guidance for my profile.`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discuss in Chatbot</span>
                </button>
              </div>
            </div>

            {/* AI Reasoning Text if available */}
            {stateChatbotAnswer && (
              <div className="p-4 bg-amber-100/50 rounded-xl border border-amber-200/80 text-xs text-stone-800 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>AI Eligibility Rationale & Guidelines</span>
                </div>
                {stateChatbotAnswer.text}
              </div>
            )}

            {/* State Schemes Grid inside the Special Chatbot Box */}
            {filteredStateSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStateSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-xl border-2 border-amber-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                            <Landmark className="w-3 h-3 text-amber-700" />
                            <span>{scheme.state} State</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                            {scheme.category}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200 shrink-0">
                          AI Referred
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectScheme(scheme)}
                        className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors cursor-pointer line-clamp-2"
                      >
                        {scheme.name}
                      </h4>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {scheme.shortDescription}
                      </p>

                      <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-100 space-y-1">
                        <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                          Financial / Welfare Benefit:
                        </div>
                        <div className="text-xs font-bold text-stone-900">
                          {scheme.financialBenefitAmount}
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{scheme.department}</span>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-stone-50/80 border-t border-amber-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectScheme(scheme)}
                        className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>View Scheme Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {scheme.officialWebsite && (
                        <a
                          href={scheme.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-stone-600 hover:text-amber-900 flex items-center gap-1 transition-colors"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center text-stone-500 border border-amber-200">
                <p className="text-xs">No state schemes matched your search query "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ==================================================== */}
      {/* SECTION 2 (BOTTOM): CENTRAL GOVERNMENT SCHEMES & SCHOLARSHIPS */}
      {/* ==================================================== */}
      <section className="space-y-4 pt-4 border-t-2 border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-emerald-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900">
                <Building className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                Central Government Schemes & Scholarships
              </h2>
            </div>
            <p className="text-stone-600 text-xs">
              National flagship welfare programs, central sector scholarships, and Ministry DBT initiatives across India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
              🇮🇳 Pan-India Central
            </span>
          </div>
        </div>

        {/* CONDITION 1: USER HAS NOT CLICKED "ASK AI FOR CENTRAL SCHEMES" YET */}
        {!centralAiQueried ? (
          <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-stone-50 border-2 border-dashed border-emerald-300/90 rounded-2xl p-8 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
              <Building className="w-7 h-7" />
            </div>
            <div className="max-w-lg mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-stone-900">
                Discover Pan-India Central Government Schemes
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Click below to have <strong>Yojana Mitra AI Chatbot</strong> evaluate all Pan-India Central Government schemes, national merit scholarships, and Ministry DBT initiatives that you are eligible for as a <strong>{currentUser?.occupation || 'citizen'}</strong>.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleAskCentralAi}
                disabled={isAskingCentralSchemes}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 hover:shadow-lg"
              >
                <Bot className={`w-4 h-4 ${isAskingCentralSchemes ? 'animate-spin' : ''}`} />
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>{isAskingCentralSchemes ? 'Evaluating Central Schemes...' : '🇮🇳 Ask AI for Central Schemes'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* CONDITION 2: SPECIAL CHATBOT BOX FOR CENTRAL SCHEMES */
          <div className="bg-gradient-to-b from-emerald-50/80 to-white rounded-2xl border-2 border-emerald-300 p-5 sm:p-6 space-y-5 shadow-sm">
            {/* Chatbot Header */}
            <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-emerald-950">
                      Yojana Mitra AI Evaluation: Central Government Schemes
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      Special Chatbot Box
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Found {filteredCentralSchemes.length} verified Central Government schemes that you are fully eligible for.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAskCentralAi}
                  disabled={isAskingCentralSchemes}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  title="Re-ask AI for Central Schemes"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAskingCentralSchemes ? 'animate-spin' : ''}`} />
                  <span>{isAskingCentralSchemes ? 'Re-evaluating...' : 'Re-ask AI'}</span>
                </button>
                <button
                  onClick={() => openChatbotWithPrompt(`Tell me more about Central Government schemes that I am eligible for and documents checklist.`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discuss in Chatbot</span>
                </button>
              </div>
            </div>

            {/* AI Reasoning Text if available */}
            {centralChatbotAnswer && (
              <div className="p-4 bg-emerald-100/50 rounded-xl border border-emerald-200/80 text-xs text-stone-800 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>AI Eligibility Rationale & Guidelines</span>
                </div>
                {centralChatbotAnswer.text}
              </div>
            )}

            {/* Central Schemes Grid inside the Special Chatbot Box */}
            {filteredCentralSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCentralSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-xl border-2 border-emerald-200/90 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                            <Building className="w-3 h-3 text-emerald-700" />
                            <span>Central Govt</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                            {scheme.category}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200 shrink-0">
                          AI Referred
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectScheme(scheme)}
                        className="text-sm font-bold text-stone-900 group-hover:text-emerald-900 transition-colors cursor-pointer line-clamp-2"
                      >
                        {scheme.name}
                      </h4>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {scheme.shortDescription}
                      </p>

                      <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-100 space-y-1">
                        <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                          Financial / Welfare Benefit:
                        </div>
                        <div className="text-xs font-bold text-stone-900">
                          {scheme.financialBenefitAmount}
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{scheme.department}</span>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-stone-50/80 border-t border-emerald-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectScheme(scheme)}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>View Scheme Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {scheme.officialWebsite && (
                        <a
                          href={scheme.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-stone-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center text-stone-500 border border-emerald-200">
                <p className="text-xs">No central schemes matched your search query "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
};
