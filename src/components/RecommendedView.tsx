import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  IndianRupee,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from './SchemeCard';
import { Scheme, SchemeCategory } from '../types';

interface RecommendedViewProps {
  onSelectScheme: (scheme: Scheme) => void;
}

export const RecommendedView: React.FC<RecommendedViewProps> = ({ onSelectScheme }) => {
  const { currentUser, recommendedSchemes, setActiveTab } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_match' | 'scholarships' | 'subsidies'>('all');

  const filtered = recommendedSchemes.filter(({ scheme, matchScore }) => {
    if (selectedFilter === 'high_match') return matchScore >= 90;
    if (selectedFilter === 'scholarships') return scheme.category === 'Scholarships' || scheme.category === 'Education';
    if (selectedFilter === 'subsidies') return scheme.category === 'Agriculture' || scheme.category === 'Business' || scheme.category === 'Housing';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-emerald-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Recommendation Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Personalized Entitlement Matching
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Based on your age ({currentUser?.age}), state ({currentUser?.state}), social category ({currentUser?.category}), and occupation ({currentUser?.occupation}).
            </p>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 bg-white text-emerald-900 hover:bg-stone-100 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            Refine Profile Parameters
          </button>
        </div>

        {/* Profile Summary Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/20 text-xs">
          <div className="bg-black/10 rounded-xl p-2.5">
            <div className="text-emerald-200 text-[10px]">Income Ceiling</div>
            <div className="font-bold text-white mt-0.5">₹{(currentUser?.annualFamilyIncome || 0).toLocaleString('en-IN')}/yr</div>
          </div>
          <div className="bg-black/10 rounded-xl p-2.5">
            <div className="text-emerald-200 text-[10px]">Category / Status</div>
            <div className="font-bold text-white mt-0.5">{currentUser?.category} • {currentUser?.areaType}</div>
          </div>
          <div className="bg-black/10 rounded-xl p-2.5">
            <div className="text-emerald-200 text-[10px]">Education Level</div>
            <div className="font-bold text-white mt-0.5 truncate">{currentUser?.highestEducation}</div>
          </div>
          <div className="bg-black/10 rounded-xl p-2.5">
            <div className="text-emerald-200 text-[10px]">Primary Matches</div>
            <div className="font-bold text-emerald-300 mt-0.5">{recommendedSchemes.length} Schemes Found</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFilter === 'all'
              ? 'bg-emerald-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All Recommendations ({recommendedSchemes.length})
        </button>
        <button
          onClick={() => setSelectedFilter('high_match')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFilter === 'high_match'
              ? 'bg-emerald-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🌟 90%+ High Match ({recommendedSchemes.filter(r => r.matchScore >= 90).length})
        </button>
        <button
          onClick={() => setSelectedFilter('scholarships')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFilter === 'scholarships'
              ? 'bg-emerald-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🎓 Scholarships & Education
        </button>
        <button
          onClick={() => setSelectedFilter('subsidies')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFilter === 'subsidies'
              ? 'bg-emerald-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🌾 Agri, Business & Housing
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rec) => (
          <SchemeCard
            key={rec.scheme.id}
            scheme={rec.scheme}
            recommendation={rec}
            onViewDetails={onSelectScheme}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <p className="text-stone-700 font-bold text-sm">No schemes in this filter tab</p>
          <button
            onClick={() => setSelectedFilter('all')}
            className="px-4 py-2 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-700"
          >
            Show All Recommended Schemes
          </button>
        </div>
      )}

    </div>
  );
};
