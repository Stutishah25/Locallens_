import React from 'react';
import { X, Lock, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-xl max-w-md w-full shadow-xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E4DB]">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#16432F]" />
            <h2 id="signin-modal-title" className="text-base font-bold text-[#1E2328]">
              Commuter Account Access
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

        {/* Phase notice */}
        <div className="p-3.5 bg-[#FAF4EB] border border-[#EADBCC] rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A5300]">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Coming in a Later Phase</span>
          </div>
          <p className="text-xs text-[#6F4400] leading-relaxed">
            Authentication, cross-device sync, and custom delay alert webhooks are planned for Phase 2 when the real backend is connected.
          </p>
        </div>

        {/* Feature roadmap preview */}
        <div className="space-y-3 text-xs text-[#3E464E]">
          <span className="font-bold text-[#1E2328] uppercase tracking-wider text-[11px]">
            Planned Account Capabilities
          </span>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16432F] shrink-0 mt-0.5" />
              <span>Multi-device synchronization of bookmarked Mumbai suburban routes.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16432F] shrink-0 mt-0.5" />
              <span>Quarterly and monthly season pass expiry tracking with renewal alerts.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16432F] shrink-0 mt-0.5" />
              <span>Reputation karma for helpful station crowd reports in your home corridor.</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E7E4DB] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#16432F] hover:bg-[#1D553C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Got it, Return to Planner
          </button>
        </div>
      </div>
    </div>
  );
};
