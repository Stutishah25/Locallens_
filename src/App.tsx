import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/trust/DemoBanner';
import { TierExplainerModal } from './components/trust/TierExplainerModal';
import { MyRoutesModal } from './components/dialogs/MyRoutesModal';
import { SignInModal } from './components/dialogs/SignInModal';
import { LandingPage } from './pages/LandingPage';
import { PlannerResultsPage } from './pages/PlannerResultsPage';
import { CorridorNetworkView } from './components/explore/CorridorNetworkView';
import { TrustPage } from './pages/TrustPage';
import { CommunityReport, JourneyOption } from './types/transit';
import { planJourney } from './api/journeysApi';
import { fetchCommunityReports } from './api/reportsApi';
import { Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'planner' | 'explore' | 'trust'>('landing');

  // Authentic Mumbai search parameters
  const [originId, setOriginId] = useState('st-ccg'); // Churchgate
  const [destinationId, setDestinationId] = useState('st-bvi'); // Borivali
  const [travelTime, setTravelTime] = useState('08:30');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Modal states
  const [isTierExplainerOpen, setIsTierExplainerOpen] = useState(false);
  const [isMyRoutesOpen, setIsMyRoutesOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Community Reports initialized via reports API (Strictly zero fake reports; starts empty)
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);

  useEffect(() => {
    fetchCommunityReports().then((reports) => {
      setCommunityReports(reports);
    });
  }, []);

  const handleAddCommunityReport = (report: CommunityReport) => {
    setCommunityReports((prev) => [report, ...prev]);
    showToast(`Your status note for ${report.stationName} was published to the active session.`);
  };

  // Saved routes in localStorage
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('locallens_saved_routes_v2');
      return stored ? JSON.parse(stored) : ['opt-direct-wr-st-ccg-st-bvi'];
    } catch {
      return ['opt-direct-wr-st-ccg-st-bvi'];
    }
  });

  const [savedRoutesList, setSavedRoutesList] = useState<JourneyOption[]>([]);

  // Load saved routes asynchronously
  useEffect(() => {
    try {
      localStorage.setItem('locallens_saved_routes_v2', JSON.stringify(savedRouteIds));
    } catch {
      // Ignore localStorage write failures in restricted environments
    }

    // Resolve saved routes
    planJourney('st-ccg', 'st-bvi').then((routes) => {
      if (routes && routes.length > 0) {
        setSavedRoutesList(routes);
      }
    });
  }, [savedRouteIds]);

  const handleToggleSaveRoute = (journeyId: string) => {
    if (savedRouteIds.includes(journeyId)) {
      setSavedRouteIds((prev) => prev.filter((id) => id !== journeyId));
      showToast('Route removed from My Routes.');
    } else {
      setSavedRouteIds((prev) => [...prev, journeyId]);
      showToast('Route saved to My Routes.');
    }
  };

  const handleSearchSubmit = (
    newOrigin: string,
    newDest: string,
    newTime: string,
    newDate: string
  ) => {
    setOriginId(newOrigin);
    setDestinationId(newDest);
    setTravelTime(newTime);
    setTravelDate(newDate);
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplorePairSelect = (fromId: string, toId: string) => {
    setOriginId(fromId);
    setDestinationId(toId);
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2328] flex flex-col antialiased selection:bg-[#EBF4F0] selection:text-[#16432F]">
      {/* Authentic Mumbai Network Notice Banner */}
      <DemoBanner onLearnMore={() => setIsTierExplainerOpen(true)} />

      {/* Top Navigation Bar following the Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedRoutesCount={savedRouteIds.length}
        onOpenMyRoutes={() => setIsMyRoutesOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'landing' && (
          <LandingPage
            onSearch={handleSearchSubmit}
            onNavigateToExplore={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTierExplainer={() => setIsTierExplainerOpen(true)}
            communityReports={communityReports}
            onAddCommunityReport={handleAddCommunityReport}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerResultsPage
            originId={originId}
            destinationId={destinationId}
            travelTime={travelTime}
            travelDate={travelDate}
            onModifySearch={(o, d, t, dt) => {
              setOriginId(o);
              setDestinationId(d);
              setTravelTime(t);
              setTravelDate(dt);
            }}
            onBackToHome={() => {
              setActiveTab('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTierExplainer={() => setIsTierExplainerOpen(true)}
            savedRouteIds={savedRouteIds}
            onToggleSaveRoute={handleToggleSaveRoute}
            savedRoutesList={savedRoutesList}
          />
        )}

        {activeTab === 'explore' && (
          <div className="space-y-6">
            <CorridorNetworkView onSelectStationPair={handleExplorePairSelect} />
          </div>
        )}

        {activeTab === 'trust' && (
          <TrustPage
            onPlanJourneyClick={() => {
              setActiveTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer with mandatory official railway channel disclaimer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenExplainer={() => setIsTierExplainerOpen(true)}
      />

      {/* Trust & Provenance Explainer Modal */}
      <TierExplainerModal
        isOpen={isTierExplainerOpen}
        onClose={() => setIsTierExplainerOpen(false)}
      />

      {/* Saved Routes Modal */}
      <MyRoutesModal
        isOpen={isMyRoutesOpen}
        onClose={() => setIsMyRoutesOpen(false)}
        savedRoutes={savedRoutesList}
        onSelectRoute={(journey) => {
          setOriginId(journey.originId);
          setDestinationId(journey.destinationId);
          setActiveTab('planner');
          setIsMyRoutesOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRemoveRoute={handleToggleSaveRoute}
      />

      {/* Sign In Phase 2 Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16432F] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-[#A1D9C0]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
