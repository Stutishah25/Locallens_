import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark,
  BookmarkCheck,
  Footprints,
  Info,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { JourneyOption, Station } from '../../types/transit';
import { MUMBAI_STATIONS, MUMBAI_RAILWAY_LINES } from '../../data/mumbaiNetworkData';
import { ProvenanceBadge } from '../trust/ProvenanceBadge';
import { CrowdIndicator } from '../trust/CrowdIndicator';
import { UnavailableNotice } from '../trust/UnavailableNotice';

interface JourneyDetailViewProps {
  journey: JourneyOption;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: (journeyId: string) => void;
}

export const JourneyDetailView: React.FC<JourneyDetailViewProps> = ({
  journey,
  onBack,
  isSaved = false,
  onToggleSave,
}) => {
  const [expandedLegs, setExpandedLegs] = useState<Record<string, boolean>>({
    [journey.legs[0]?.id || '']: true,
  });
  const [copied, setCopied] = useState(false);

  const getStation = (id: string): Station | undefined =>
    MUMBAI_STATIONS.find((s) => s.id === id);

  const toggleLegExpand = (legId: string) => {
    setExpandedLegs((prev) => ({
      ...prev,
      [legId]: !prev[legId],
    }));
  };

  const originStation = getStation(journey.originId);
  const destStation = getStation(journey.destinationId);

  const handleCopySummary = () => {
    const origin = originStation?.name || 'Origin';
    const dest = destStation?.name || 'Destination';
    const text = `LocalLens Mumbai Transit Route: ${journey.title}\nRoute: ${origin} → ${dest}\nLine: ${MUMBAI_RAILWAY_LINES[journey.primaryLineId]?.name || 'Suburban'}\nStops: ${journey.legs.reduce((acc, l) => acc + l.stopsCount, 0)} stops\n(Verified Mumbai suburban topology · Real timetable pending FastAPI backend)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6E3DB]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#16432F] hover:text-[#1D553C] transition-colors p-1 -ml-1 rounded hover:bg-[#EBF4F0] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(journey.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#EBF4F0] border-[#C6DFD4] text-[#16432F]'
                  : 'bg-white border-[#DDD9CE] text-[#444D55] hover:bg-[#FAF9F5]'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved Route' : 'Save Route'}</span>
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DDD9CE] text-[#444D55] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#16432F]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied summary' : 'Copy Route'}</span>
          </button>
        </div>
      </div>

      {/* Main Overview Card */}
      <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <ProvenanceBadge provenance={journey.provenance} showDetails />
              <span className="text-xs text-[#16432F] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Mumbai Suburban Railway Network</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E2328] tracking-tight">
              {journey.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#525B64]">{journey.subtitle}</p>
          </div>

          <div className="text-right sm:border-l sm:border-[#EDEAE1] sm:pl-6 space-y-1">
            <div className="text-xs uppercase font-semibold tracking-wider text-[#7E8893]">
              Interchange Hubs
            </div>
            <div className="text-base sm:text-lg font-bold text-[#1E2328]">
              {journey.interchangesCount === 0
                ? 'Direct (0 Transfers)'
                : `${journey.interchangeStations.join(', ')}`}
            </div>
            <div className="text-[11px] text-[#5A636C]">
              {journey.legs.reduce((acc, l) => acc + l.stopsCount, 0)} total station stops
            </div>
          </div>
        </div>

        {/* Timetable / Schedule State Notice */}
        <div className="p-4 bg-[#FAF9F5] border border-[#E6E3DB] rounded-lg">
          {journey.timetableStatus === 'verified' && journey.departureTime && journey.arrivalTime ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#737E88]">Depart</span>
                  <div className="font-bold text-base text-[#1E2328] tabular-nums">
                    {journey.departureTime}
                  </div>
                  <div className="text-xs text-[#525B64]">{originStation?.name}</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-xs font-semibold text-[#16432F] flex items-center gap-1 justify-center">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{journey.durationDisplay}</span>
                  </div>
                  <div className="w-24 h-0.5 bg-[#C6DFD4] mx-auto mt-1" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#737E88]">Arrive</span>
                  <div className="font-bold text-base text-[#1E2328] tabular-nums">
                    {journey.arrivalTime}
                  </div>
                  <div className="text-xs text-[#525B64]">{destStation?.name}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <UnavailableNotice
                type="timetable"
                customMessage="Verified timetable information is not currently available for this journey. Live schedule feeds and precise departure minutes will be connected when the railway backend API is integrated. Station sequence and verified transfer alignment are shown below."
              />
            </div>
          )}
        </div>

        {/* Live Train Tracking Notice */}
        <div className="p-4 bg-[#FAF9F5] border border-[#E6E3DB] rounded-lg">
          <UnavailableNotice
            type="live_gps"
            customMessage="Live train tracking is not connected yet. Real-time GPS telematics and live delay alerts require official railway feeds."
          />
        </div>

        {/* Overall Crowd Intelligence Banner */}
        <div className="p-4 bg-[#FCFBF8] border border-[#E9E6DC] rounded-lg space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5C656E]">
            Corridor Crowd Intelligence
          </div>
          <CrowdIndicator
            level={journey.crowdSummary.level}
            confidence={journey.crowdSummary.confidence}
            detailed
            explanation={journey.crowdSummary.summaryText}
          />
        </div>
      </div>

      {/* Leg-by-leg Route Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1E2328]">Leg-by-Leg Route & Station Sequence</h2>
          <span className="text-xs text-[#6B757F]">
            {journey.legs.length} {journey.legs.length === 1 ? 'railway leg' : 'railway legs'}
          </span>
        </div>

        <div className="space-y-5">
          {journey.legs.map((leg, index) => {
            const line = MUMBAI_RAILWAY_LINES[leg.lineId] || MUMBAI_RAILWAY_LINES.western;
            const legFrom = getStation(leg.fromStationId);
            const legTo = getStation(leg.toStationId);
            const isExpanded = expandedLegs[leg.id] ?? false;

            return (
              <div
                key={leg.id}
                className="bg-white border border-[#E2DFD6] rounded-xl overflow-hidden shadow-xs"
              >
                {/* Leg Header */}
                <div className="px-5 py-4 border-b border-[#F0EDE5] flex flex-wrap items-center justify-between gap-3 bg-[#FCFBF8]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: line.bgColor,
                        color: line.textColor,
                        border: `1px solid ${line.borderColor}`,
                      }}
                    >
                      {line.shortCode}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1E2328]">{line.name}</span>
                        <span className="text-[11px] text-[#636E78]">({leg.stopsCount} stops)</span>
                      </div>
                      <div className="text-xs text-[#5C6670]">
                        {legFrom?.name} ({legFrom?.code}) to {legTo?.name} ({legTo?.code})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ProvenanceBadge provenance={leg.provenance} size="sm" />
                  </div>
                </div>

                {/* Leg Details Content */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Stations Timeline */}
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D5D2C7]">
                    {/* Boarding Station */}
                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#16432F] ring-4 ring-white" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1E2328]">{legFrom?.name}</span>
                          <span className="text-[11px] font-mono text-[#78828D]">({legFrom?.code})</span>
                          <span className="text-[11px] text-[#16432F] font-semibold">Boarding Station</span>
                        </div>
                        <div className="text-xs text-[#636E78] mt-0.5">
                          Zone: {legFrom?.zone} · Facilities: {legFrom?.facilities.join(', ')}
                        </div>
                      </div>
                    </div>

                    {/* Intermediate Stations Accordion */}
                    {leg.intermediateStations.length > 0 && (
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => toggleLegExpand(leg.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-[#525B64] hover:text-[#1E2328] font-medium py-1 px-2 rounded hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          <span>
                            {isExpanded
                              ? `Hide ${leg.intermediateStations.length} intermediate stations`
                              : `Show ${leg.intermediateStations.length} intermediate stations`}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2.5 space-y-2.5 pl-4 border-l-2 border-dashed border-[#DDD9CE]">
                            {leg.intermediateStations.map((stId) => {
                              const st = getStation(stId);
                              return (
                                <div key={stId} className="text-xs flex items-center justify-between text-[#5C656F]">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#99A2AA]" />
                                    <span className="font-medium text-[#2E353D]">{st?.name}</span>
                                    <span className="font-mono text-[10px] text-[#86909A]">({st?.code})</span>
                                  </div>
                                  <span className="text-[11px] text-[#7C8690]">
                                    {st?.isInterchange ? 'Interchange Junction' : 'Suburban Station'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Alighting Station */}
                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#1E4B75] ring-4 ring-white" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1E2328]">{legTo?.name}</span>
                          <span className="text-[11px] font-mono text-[#78828D]">({legTo?.code})</span>
                          <span className="text-[11px] text-[#1E4B75] font-semibold">
                            {index === journey.legs.length - 1 ? 'Final Destination' : 'Transfer Station'}
                          </span>
                        </div>
                        <div className="text-xs text-[#636E78] mt-0.5">
                          Zone: {legTo?.zone} · Facilities: {legTo?.facilities.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transfer / Interchange Guide if present */}
                  {leg.transferDetails && (
                    <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#1E2328]">
                        <Footprints className="w-4 h-4 text-[#8A5300]" />
                        <span>Platform Transfer Directions at {legTo?.name}</span>
                      </div>
                      <p className="text-[#59626A] leading-relaxed">
                        {leg.transferDetails.footbridgeNotes}
                      </p>
                      {leg.transferDetails.platforms && (
                        <div className="pt-1 text-[#4E565E]">
                          <strong>Platforms:</strong> {leg.transferDetails.platforms}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Leg Crowd status */}
                  <div className="pt-2 border-t border-[#F0EDE5] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#656F7A]">Leg Crowd State:</span>
                      <CrowdIndicator
                        level={leg.crowdState.level}
                        confidence={leg.crowdState.confidence}
                        compact
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
