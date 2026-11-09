import React from 'react';
import { Users, Info, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CrowdLevel, CrowdConfidence } from '../../types/transit';

interface CrowdIndicatorProps {
  level: CrowdLevel;
  confidence: CrowdConfidence;
  compact?: boolean;
  detailed?: boolean;
  explanation?: string;
}

export const CrowdIndicator: React.FC<CrowdIndicatorProps> = ({
  level,
  confidence,
  compact = false,
  detailed = false,
  explanation,
}) => {
  // State 3: No recent crowd information
  if (confidence === 'no_recent_data' || level === 'unavailable') {
    return (
      <div className={`flex flex-col gap-1 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center gap-1.5 text-[#5C656E]">
          <HelpCircle className="w-4 h-4 text-[#7A838C] shrink-0" aria-hidden="true" />
          <span className="font-medium text-[#444D55]">
            No recent crowd information is available for this journey.
          </span>
          <span className="text-[10px] font-semibold bg-[#EFECE5] text-[#555E66] px-1.5 py-0.5 rounded border border-[#DFDAD0]">
            Feed Unavailable
          </span>
        </div>
        {detailed && (
          <p className="text-xs text-[#6B757F] pl-5.5 leading-relaxed">
            Neither live passenger observations nor verified baseline models are currently active for this suburban route. LocalLens does not estimate crowd levels without genuine data.
          </p>
        )}
      </div>
    );
  }

  // Level configuration with text + icon (no fabricated percentages)
  const levelConfig: Record<CrowdLevel, { label: string; textClass: string; bgClass: string; borderClass: string }> = {
    low: {
      label: 'Light Passenger Volume',
      textClass: 'text-[#16432F]',
      bgClass: 'bg-[#EBF4F0]',
      borderClass: 'border-[#C6DFD4]',
    },
    moderate: {
      label: 'Moderate Passenger Volume',
      textClass: 'text-[#1E4B75]',
      bgClass: 'bg-[#EBF2F8]',
      borderClass: 'border-[#C2D7E9]',
    },
    high: {
      label: 'Dense Platform / Train Flow',
      textClass: 'text-[#8A5300]',
      bgClass: 'bg-[#FEF6E7]',
      borderClass: 'border-[#F8DFA7]',
    },
    heavy: {
      label: 'Heavy Peak Rush Volume',
      textClass: 'text-[#9E2B2B]',
      bgClass: 'bg-[#FDF0F0]',
      borderClass: 'border-[#F4D0D0]',
    },
    unavailable: {
      label: 'Status Unavailable',
      textClass: 'text-[#555F6A]',
      bgClass: 'bg-[#FAF9F5]',
      borderClass: 'border-[#DDD9CE]',
    },
  };

  const currentLevel = levelConfig[level] || levelConfig.unavailable;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium ${currentLevel.bgClass} ${currentLevel.textClass} ${currentLevel.borderClass}`}
        >
          <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{currentLevel.label}</span>
        </div>

        {/* State 1: Genuine report-backed */}
        {confidence === 'report_backed' && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16432F] bg-[#EBF4F0] px-2 py-0.5 rounded border border-[#C6DFD4]">
            <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Genuine Commuter Report-Backed</span>
          </span>
        )}

        {/* State 2: Genuine baseline estimate */}
        {confidence === 'baseline_estimate' && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E4B75] bg-[#EBF2F8] px-2 py-0.5 rounded border border-[#C2D7E9]">
            <Info className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Verified Historical Baseline</span>
          </span>
        )}
      </div>

      {detailed && explanation && (
        <div className="flex items-start gap-1.5 text-xs text-[#525B64] pt-0.5">
          <Info className="w-3.5 h-3.5 text-[#737E88] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
};
