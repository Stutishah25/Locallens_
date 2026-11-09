import React from 'react';
import { CheckCircle2, Info, HelpCircle } from 'lucide-react';
import { CrowdConfidence } from '../../types/transit';

interface ConfidenceIndicatorProps {
  confidence: CrowdConfidence;
  showExplanation?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  showExplanation = false,
}) => {
  if (confidence === 'report_backed') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-[#16432F]">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#16432F]" aria-hidden="true" />
        <span className="font-semibold">Report-Backed</span>
        {showExplanation && (
          <span className="text-[#55616C]">· corroborated by active commuter submissions</span>
        )}
      </div>
    );
  }

  if (confidence === 'baseline_estimate') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-[#1E4B75]">
        <Info className="w-3.5 h-3.5 shrink-0 text-[#1E4B75]" aria-hidden="true" />
        <span className="font-semibold">Calculated Baseline</span>
        {showExplanation && (
          <span className="text-[#55616C]">· derived from verified timetable headways</span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-[#525B64]">
      <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[#737E88]" aria-hidden="true" />
      <span className="font-semibold">No Recent Data</span>
      {showExplanation && (
        <span className="text-[#55616C]">· real-time feed not connected</span>
      )}
    </div>
  );
};
