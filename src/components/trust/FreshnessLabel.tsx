import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface FreshnessLabelProps {
  timeAgoText: string;
  isStale?: boolean;
  minutesAgo?: number;
}

export const FreshnessLabel: React.FC<FreshnessLabelProps> = ({
  timeAgoText,
  isStale = false,
  minutesAgo,
}) => {
  const stale = isStale || (minutesAgo !== undefined && minutesAgo > 45);

  if (stale) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9E3A24] bg-[#FDF0ED] px-2 py-0.5 rounded border border-[#F5D0C6]">
        <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>{timeAgoText} (Stale — do not rely)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-[#5C656D]">
      <Clock className="w-3 h-3 text-[#7B858E] shrink-0" aria-hidden="true" />
      <span>{timeAgoText}</span>
    </span>
  );
};
