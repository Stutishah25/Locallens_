import React from 'react';
import {
  CheckCircle2,
  FileText,
  Users,
  AlertCircle,
  Loader2,
  HelpCircle,
  Inbox,
} from 'lucide-react';
import { ProvenanceState } from '../../types/transit';

interface DataStateBlockProps {
  state: ProvenanceState | 'loading' | 'error' | 'empty';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const DataStateBlock: React.FC<DataStateBlockProps> = ({
  state,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  let Icon = HelpCircle;
  let defaultTitle = 'Information State';
  let defaultDesc = 'Data provenance status';
  let containerClass = 'bg-[#FAF9F5] border-[#E2DFD6] text-[#444D55]';
  let iconClass = 'text-[#6A747E]';
  let badgeLabel = 'Unavailable';

  switch (state) {
    case 'scheduled_verified':
      Icon = CheckCircle2;
      defaultTitle = 'Verified Railway Schedule';
      defaultDesc = 'Official timetable information from verified railway feeds.';
      containerClass = 'bg-[#EBF4F0] border-[#C6DFD4] text-[#16432F]';
      iconClass = 'text-[#16432F]';
      badgeLabel = 'Verified Schedule';
      break;

    case 'estimated':
      Icon = FileText;
      defaultTitle = 'Estimated Parameter';
      defaultDesc = 'Calculated from verified network layout and headway intervals.';
      containerClass = 'bg-[#EBF2F8] border-[#C2D7E9] text-[#1E4B75]';
      iconClass = 'text-[#1E4B75]';
      badgeLabel = 'Calculated Estimate';
      break;

    case 'community':
      Icon = Users;
      defaultTitle = 'Commuter-Sourced Observation';
      defaultDesc = 'Contributed by active suburban passengers on the ground.';
      containerClass = 'bg-[#FAF4EB] border-[#E8DAC2] text-[#824D00]';
      iconClass = 'text-[#824D00]';
      badgeLabel = 'Community Sourced';
      break;

    case 'unavailable':
      Icon = HelpCircle;
      defaultTitle = 'Information Unavailable';
      defaultDesc = 'This feed is currently not connected or published by railway systems.';
      containerClass = 'bg-[#FAF9F5] border-[#DDD9CE] text-[#555F6A]';
      iconClass = 'text-[#7B858E]';
      badgeLabel = 'Feed Unavailable';
      break;

    case 'loading':
      Icon = Loader2;
      defaultTitle = 'Querying Transit Feed...';
      defaultDesc = 'Communicating with suburban network endpoints.';
      containerClass = 'bg-[#FAF9F5] border-[#DDD9CE] text-[#555F6A]';
      iconClass = 'text-[#16432F] animate-spin';
      badgeLabel = 'Querying';
      break;

    case 'error':
      Icon = AlertCircle;
      defaultTitle = 'Connection Error';
      defaultDesc = 'Unable to reach transit endpoint. Please check your connection.';
      containerClass = 'bg-[#FDF0ED] border-[#F5D0C6] text-[#9E3A24]';
      iconClass = 'text-[#9E3A24]';
      badgeLabel = 'Endpoint Error';
      break;

    case 'empty':
      Icon = Inbox;
      defaultTitle = 'No Records Found';
      defaultDesc = 'There is currently no data to display for this selection.';
      containerClass = 'bg-white border-[#E2DFD6] text-[#555F6A]';
      iconClass = 'text-[#8A95A0]';
      badgeLabel = 'No Data';
      break;
  }

  const finalTitle = title || defaultTitle;
  const finalDesc = description || defaultDesc;

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm ${containerClass} ${className}`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} aria-hidden="true" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E2328]">{finalTitle}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border border-current opacity-85">
              {badgeLabel}
            </span>
          </div>
          <p className="text-[#5C656E] leading-relaxed text-xs">{finalDesc}</p>
        </div>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-current shadow-2xs hover:bg-[#FAF9F5] transition-colors cursor-pointer shrink-0"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
