import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { RecommendedView } from './components/RecommendedView';
import { SchemesView } from './components/SchemesView';
import { DeadlinesView } from './components/DeadlinesView';
import { AppliedSchemesView } from './components/AppliedSchemesView';
import { ProfileView } from './components/ProfileView';
import { SchemeDetails } from './components/SchemeDetails';
import { AuthView } from './components/AuthView';
import { OnboardingView } from './components/OnboardingView';
import { NotificationsModal } from './components/NotificationsModal';
import { GeminiChatBot } from './components/GeminiChatBot';
import { Scheme } from './types';

const MainContent: React.FC = () => {
  const { currentUser, isOnboarding, activeTab } = useApp();
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // If citizen not authenticated, show Login/Signup screen
  if (!currentUser) {
    return <AuthView />;
  }

  // If newly registered citizen requires onboarding
  if (isOnboarding) {
    return <OnboardingView />;
  }

  const renderActiveView = () => {
    if (selectedScheme) {
      return (
        <SchemeDetails
          scheme={selectedScheme}
          onBack={() => setSelectedScheme(null)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeView onSelectScheme={setSelectedScheme} />;
      case 'recommended':
        return <RecommendedView onSelectScheme={setSelectedScheme} />;
      case 'schemes':
        return <SchemesView onSelectScheme={setSelectedScheme} />;
      case 'deadlines':
        return <DeadlinesView onSelectScheme={setSelectedScheme} />;
      case 'applied':
        return <AppliedSchemesView onSelectScheme={setSelectedScheme} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView onSelectScheme={setSelectedScheme} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased selection:bg-orange-500/20 selection:text-orange-950">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-28 md:pb-6">
        
        {/* Persistent Taskbar / Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Notifications Drawer / Modal */}
      <NotificationsModal onSelectScheme={setSelectedScheme} />

      {/* Floating Gemini AI Chat Bot */}
      <GeminiChatBot onSelectScheme={setSelectedScheme} />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
