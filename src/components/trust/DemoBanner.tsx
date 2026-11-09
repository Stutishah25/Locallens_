import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

interface DemoBannerProps {
  onLearnMore?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onLearnMore }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="bg-[#FAF9F5] border-b border-[#E7E5DE] px-4 py-1.5 text-xs text-[#5C646B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#16432F]">Authentic Mumbai Network Active</span>
          <span>·</span>
          <span>Verified station & line topology</span>
        </div>
        <button
          onClick={() => setDismissed(false)}
          className="underline hover:text-[#1E2328] transition-colors cursor-pointer"
        >
          Show data transparency notice
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] border-b border-[#DFDDD5] text-[#1E2328] px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#16432F] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p className="leading-snug text-[#343B42]">
            <strong className="font-semibold text-[#16432F]">Authentic Mumbai Network:</strong> Verified Western, Central, and Harbour railway lines mapped. Live timetables and real-time train tracking feeds are currently unavailable pending backend integration. Zero fabricated schedules are shown.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-1 font-medium text-[#16432F] hover:underline text-xs cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Data Provenance Standards</span>
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-[#6A737D] hover:text-[#1E2328] transition-colors rounded cursor-pointer"
            aria-label="Dismiss transparency banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
