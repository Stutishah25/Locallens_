import React from 'react';
import { X, CheckCircle2, FileText, Users, HelpCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface TierExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TierExplainerModal: React.FC<TierExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explainer-title"
    >
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DB]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#16432F]" />
            <h2 id="explainer-title" className="text-lg font-bold text-[#1E2328]">
              Data Provenance & Trust Standards
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5C656E] hover:text-[#1E2328] hover:bg-[#EFECE5] rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5 text-sm text-[#3E464E] leading-relaxed">
          <p>
            Commuting on the Mumbai Suburban Railway demands absolute accuracy. LocalLens adheres to strict data integrity: we never invent departure times, fake crowd percentages, or simulate artificial live train positions.
          </p>

          <div className="space-y-3">
            <h3 className="font-bold text-[#1E2328] text-base">The Five Provenance States</h3>

            {/* scheduled_verified */}
            <div className="bg-white border border-[#E2DFD6] rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16432F]" />
                <span className="font-semibold text-[#16432F]">1. scheduled_verified</span>
              </div>
              <p className="text-xs text-[#525B64]">
                Applies exclusively to information sourced directly from verified, permitted railway timetable feeds. Never used for estimates or unverified data.
              </p>
            </div>

            {/* estimated */}
            <div className="bg-white border border-[#E2DFD6] rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1E4B75]" />
                <span className="font-semibold text-[#1E4B75]">2. estimated</span>
              </div>
              <p className="text-xs text-[#525B64]">
                Genuine calculations derived from verified railway network topology, station distances, and published operational headways. Never passed off as exact clock-time schedules.
              </p>
            </div>

            {/* community */}
            <div className="bg-white border border-[#E2DFD6] rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#824D00]" />
                <span className="font-semibold text-[#824D00]">3. community</span>
              </div>
              <p className="text-xs text-[#525B64]">
                Information contributed by real passengers on platforms and stairwells. Submissions are timestamped and automatically flagged as stale after 45 minutes.
              </p>
            </div>

            {/* unavailable */}
            <div className="bg-white border border-[#E2DFD6] rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#555F6A]" />
                <span className="font-semibold text-[#555F6A]">4. unavailable</span>
              </div>
              <p className="text-xs text-[#525B64]">
                Shown clearly whenever timetable, crowd, or live telemetry feeds are not currently connected. We provide the verified station sequence and physical interchange path without inventing fake times.
              </p>
            </div>

            {/* demo */}
            <div className="bg-white border border-[#E2DFD6] rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#55308D]" />
                <span className="font-semibold text-[#55308D]">5. demo (Internal Only)</span>
              </div>
              <p className="text-xs text-[#525B64]">
                Strictly reserved for automated developer test suites. Internal test fixtures are never exposed to commuters in the live application.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-[#1E2328] text-base">Crowd Intelligence Rules</h3>
            <ul className="space-y-2 text-xs text-[#525B64] list-disc pl-5">
              <li>
                <strong>No Fake Percentages:</strong> We never generate arbitrary metrics like &quot;72% crowded&quot; or claim automated coach weight telemetry.
              </li>
              <li>
                <strong>Genuine Report-Backed:</strong> Sourced from active passenger notes on station staircases and doorways.
              </li>
              <li>
                <strong>Verified Baseline Estimate:</strong> Derived from typical timetable headways with clear explanation of methodology.
              </li>
              <li>
                <strong>Honest Unavailable Notice:</strong> When recent data is absent, we explicitly display: <em>&quot;No recent crowd information is available for this journey.&quot;</em>
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-[#FAF3E8] border border-[#F2DEB5] rounded-lg flex items-start gap-2.5 text-xs text-[#6F4400]">
            <AlertCircle className="w-4 h-4 text-[#8A5300] shrink-0 mt-0.5" />
            <p>
              <strong>Official Railway Channels:</strong> LocalLens is an independent commuter intelligence project. Always verify critical travel updates through official Western Railway, Central Railway, and UTS mobile ticketing channels.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E7E4DB] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#16432F] hover:bg-[#1D553C] rounded-lg transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
