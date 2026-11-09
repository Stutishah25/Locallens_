import React from 'react';
import { ArrowRight, Clock, Shuffle, Bookmark, BookmarkCheck, ChevronRight, HelpCircle } from 'lucide-react';
import { JourneyOption } from '../../types/transit';
import { MUMBAI_RAILWAY_LINES } from '../../data/mumbaiNetworkData';
import { ProvenanceBadge } from '../trust/ProvenanceBadge';
import { CrowdIndicator } from '../trust/CrowdIndicator';

interface JourneyResultCardProps {
  journey: JourneyOption;
  onViewDetails: (journey: JourneyOption) => void;
  isSaved?: boolean;
  onToggleSave?: (journeyId: string) => void;
}

export const JourneyResultCard: React.FC<JourneyResultCardProps> = ({
  journey,
  onViewDetails,
  isSaved = false,
  onToggleSave,
}) => {
  const primaryLine = MUMBAI_RAILWAY_LINES[journey.primaryLineId] || MUMBAI_RAILWAY_LINES.western;

  return (
    <div className="bg-white border border-[#E2DFD6] hover:border-[#C6DFD4] rounded-xl shadow-xs transition-all hover:shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Top Bar: Data Provenance & Badges */}
      <div className="px-5 pt-3.5 pb-2.5 border-b border-[#F0EDE5] flex flex-wrap items-center justify-between gap-2 bg-[#FCFBF8]">
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance={journey.provenance} size="sm" showDetails />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#656F7A]">Network Topology:</span>
          <span className="font-semibold text-[#16432F]">Verified Mumbai Alignment</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Title & Line */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1E2328] tracking-tight">
              {journey.title}
            </h3>
            <p className="text-xs text-[#5D6670] mt-0.5">{journey.subtitle}</p>
          </div>

          <div
            className="px-2.5 py-1 rounded text-xs font-bold shrink-0 border"
            style={{
              backgroundColor: primaryLine.bgColor,
              borderColor: primaryLine.borderColor,
              color: primaryLine.textColor,
            }}
          >
            {primaryLine.shortCode} · {primaryLine.name.split(' ')[0]}
          </div>
        </div>

        {/* Timings / Schedule Status Display */}
        <div className="bg-[#FAF9F5] border border-[#EBE8DF] rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          {journey.timetableStatus === 'verified' && journey.departureTime && journey.arrivalTime ? (
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1.5 font-bold text-[#1E2328]">
                <span className="tabular-nums text-base">{journey.departureTime}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#737E88]" />
                <span className="tabular-nums text-base">{journey.arrivalTime}</span>
              </div>
              <span className="text-[#88929C]">·</span>
              <div className="flex items-center gap-1 font-semibold text-[#16432F]">
                <Clock className="w-3.5 h-3.5" />
                <span>{journey.durationDisplay}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#4A5560]">
                <HelpCircle className="w-3.5 h-3.5 text-[#7B858E]" />
                <span>Verified Timetable Feed: Offline</span>
              </div>
              <p className="text-[11px] text-[#6A7580]">
                {journey.timetableNotice || 'Live railway departure hours not connected.'}
              </p>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-[#5A636C] font-medium">
            <Shuffle className="w-3.5 h-3.5 text-[#7E8893]" />
            <span>
              {journey.interchangesCount === 0
                ? 'Direct Suburban Route (0 Transfers)'
                : `${journey.interchangesCount} Interchange (${journey.interchangeStations.join(', ')})`}
            </span>
          </div>
        </div>

        {/* Crowd Intelligence Section */}
        <div className="pt-1 border-t border-[#F0EDE5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CrowdIndicator
              level={journey.crowdSummary.level}
              confidence={journey.crowdSummary.confidence}
              compact
            />
            {journey.crowdSummary.lastUpdatedText && (
              <span className="text-[11px] text-[#6F7984]">
                Status: {journey.crowdSummary.lastUpdatedText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-[#FAF9F5] border-t border-[#EAE7DF] flex items-center justify-between gap-3">
        {onToggleSave ? (
          <button
            type="button"
            onClick={() => onToggleSave(journey.id)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#EBF4F0] text-[#16432F] border border-[#C6DFD4]'
                : 'text-[#58626C] hover:text-[#1E2328] hover:bg-[#EFECE5]'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-[#16432F]" />
                <span>Saved to My Routes</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Route</span>
              </>
            )}
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={() => onViewDetails(journey)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#16432F] hover:bg-[#1D553C] rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          <span>View Station Alignment & Legs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
