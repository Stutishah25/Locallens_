import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Info,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { JourneyOption, Station } from '../types/transit';
import { MUMBAI_STATIONS } from '../data/mumbaiNetworkData';
import { planJourney } from '../api/journeysApi';
import { JourneyResultCard } from '../components/planner/JourneyResultCard';
import { JourneyDetailView } from '../components/planner/JourneyDetailView';
import { JourneySearchCard } from '../components/planner/JourneySearchCard';
import { DataStateBlock } from '../components/trust/DataStateBlock';

interface PlannerResultsPageProps {
  originId: string;
  destinationId: string;
  travelTime: string;
  travelDate: string;
  onModifySearch: (originId: string, destinationId: string, time: string, date: string) => void;
  onBackToHome: () => void;
  onOpenTierExplainer: () => void;
  savedRouteIds: string[];
  onToggleSaveRoute: (journeyId: string) => void;
  savedRoutesList: JourneyOption[];
}

export const PlannerResultsPage: React.FC<PlannerResultsPageProps> = ({
  originId,
  destinationId,
  travelTime,
  travelDate,
  onModifySearch,
  onBackToHome,
  onOpenTierExplainer,
  savedRouteIds,
  onToggleSaveRoute,
}) => {
  const [selectedJourney, setSelectedJourney] = useState<JourneyOption | null>(null);
  const [isEditSearchOpen, setIsEditSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'interchange'>('all');

  const [loading, setLoading] = useState(true);
  const [journeyOptions, setJourneyOptions] = useState<JourneyOption[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const originStation = MUMBAI_STATIONS.find((s) => s.id === originId) || MUMBAI_STATIONS[0];
  const destStation = MUMBAI_STATIONS.find((s) => s.id === destinationId) || MUMBAI_STATIONS[1];

  // Fetch verified topological journeys asynchronously through the API layer
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setErrorMessage(null);

    planJourney(originId, destinationId, travelTime, travelDate)
      .then((results) => {
        if (isCurrent) {
          setJourneyOptions(results);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          setErrorMessage(err.message || 'Unable to compute suburban railway route.');
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [originId, destinationId, travelTime, travelDate]);

  // Apply filters
  const filteredOptions = journeyOptions.filter((option) => {
    if (activeFilter === 'direct') {
      return option.interchangesCount === 0;
    }
    if (activeFilter === 'interchange') {
      return option.interchangesCount > 0;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Back button and quick navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#16432F] hover:text-[#1D553C] transition-colors p-1 -ml-1 rounded hover:bg-[#EBF4F0] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Commute Search</span>
        </button>

        <button
          onClick={onOpenTierExplainer}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16432F] bg-white border border-[#C6DFD4] px-3 py-1.5 rounded-lg hover:bg-[#EBF4F0] transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Data Provenance Standards</span>
        </button>
      </div>

      {/* Search Summary Header Bar */}
      <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#16432F]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Mumbai Suburban Railway Route</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-lg sm:text-xl font-bold text-[#1E2328]">
              <span>{originStation.name}</span>
              <span className="text-xs font-mono text-[#78828D]">({originStation.code})</span>
              <ArrowRight className="w-4 h-4 text-[#78828D]" />
              <span>{destStation.name}</span>
              <span className="text-xs font-mono text-[#78828D]">({destStation.code})</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C656F] pt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#7B858E]" />
                {travelDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#7B858E]" />
                Target window: {travelTime}
              </span>
              <span>·</span>
              <span>{journeyOptions.length} route options evaluated</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditSearchOpen(!isEditSearchOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E2328] bg-[#FAF9F5] hover:bg-[#EFECE5] border border-[#DDD9CE] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isEditSearchOpen ? 'Hide Search Form' : 'Change Stations / Time'}</span>
          </button>
        </div>

        {/* Collapsible Edit Search Card */}
        {isEditSearchOpen && (
          <div className="pt-4 border-t border-[#F0EDE5]">
            <JourneySearchCard
              initialOriginId={originId}
              initialDestinationId={destinationId}
              initialTime={travelTime}
              onSearch={(o, d, t, dt) => {
                onModifySearch(o, d, t, dt);
                setIsEditSearchOpen(false);
                setSelectedJourney(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Main View: Either Detail View or Results List */}
      {selectedJourney ? (
        <JourneyDetailView
          journey={selectedJourney}
          onBack={() => setSelectedJourney(null)}
          isSaved={savedRouteIds.includes(selectedJourney.id)}
          onToggleSave={onToggleSaveRoute}
        />
      ) : loading ? (
        <div className="p-12 bg-white border border-[#E2DFD6] rounded-xl text-center space-y-3">
          <Loader2 className="w-6 h-6 text-[#16432F] animate-spin mx-auto" />
          <p className="font-semibold text-sm text-[#1E2328]">Computing verified route options...</p>
          <p className="text-xs text-[#6A747E]">
            Evaluating suburban track topology between {originStation.name} and {destStation.name}.
          </p>
        </div>
      ) : errorMessage ? (
        <DataStateBlock
          state="error"
          title="Routing Service Error"
          description={errorMessage}
          actionText="Try Another Route"
          onAction={() => setIsEditSearchOpen(true)}
        />
      ) : journeyOptions.length === 0 ? (
        <div className="p-8 sm:p-12 bg-white border border-[#E2DFD6] rounded-xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#DDD9CE] text-[#8A95A0] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1E2328]">
              Journey information is currently unavailable.
            </h3>
            <p className="text-xs sm:text-sm text-[#5C656F] max-w-lg mx-auto leading-relaxed">
              Direct or single-interchange suburban rail alignments between <strong>{originStation.name}</strong> and <strong>{destStation.name}</strong> could not be verified in the local topology dataset. Additional feeder connections and multi-hop transfers will be supplied when the FastAPI backend is connected.
            </p>
          </div>
          <button
            onClick={() => setIsEditSearchOpen(true)}
            className="mt-2 px-4 py-2 bg-[#16432F] hover:bg-[#1D553C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Modify Selected Stations
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-[#E2DFD6] rounded-xl text-xs">
            <div className="flex items-center gap-2 text-[#565F6A] font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>Route Filter:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `All Options (${journeyOptions.length})` },
                { id: 'direct', label: 'Direct Corridor Only' },
                { id: 'interchange', label: 'Interchange Routes' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-[#16432F] text-white shadow-2xs'
                      : 'bg-[#FAF9F5] text-[#555F6A] hover:text-[#1E2328] border border-[#DDD9CE]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid / List */}
          <div className="space-y-4">
            {filteredOptions.length === 0 ? (
              <div className="p-10 bg-white border border-[#E2DFD6] rounded-xl text-center space-y-2">
                <p className="font-bold text-sm text-[#1E2328]">No routes match your filter</p>
                <p className="text-xs text-[#5D6772]">
                  Select &quot;All Options&quot; to inspect all verified topological options.
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-2 px-3 py-1.5 bg-[#16432F] text-white text-xs font-semibold rounded-lg"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredOptions.map((journey) => (
                <JourneyResultCard
                  key={journey.id}
                  journey={journey}
                  onViewDetails={(j) => setSelectedJourney(j)}
                  isSaved={savedRouteIds.includes(journey.id)}
                  onToggleSave={onToggleSaveRoute}
                />
              ))
            )}
          </div>

          {/* Honest Unavailable State Explainer Strip */}
          <div className="p-4 bg-[#FAF9F5] border border-[#E4E1D7] rounded-xl text-xs text-[#525B64] space-y-1">
            <div className="font-semibold text-[#1E2328] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#16432F]" />
              <span>Data Provenance & Current Feed Status</span>
            </div>
            <p className="leading-relaxed">
              Verified physical station alignment and interchange footbridge paths are confirmed. Exact train departure times and live crowd indicators are marked <strong>unavailable</strong> until official railway schedule feeds are integrated into the FastAPI backend.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
