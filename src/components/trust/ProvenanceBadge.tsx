import React from 'react';
import { CheckCircle2, FileText, Users, HelpCircle, ShieldAlert } from 'lucide-react';
import { ProvenanceState } from '../../types/transit';

interface ProvenanceBadgeProps {
  provenance: ProvenanceState;
  size?: 'sm' | 'md';
  showDetails?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  size = 'md',
  showDetails = false,
}) => {
  let label = 'Feed Unavailable';
  let subtext = 'Information not currently provided';
  let Icon = HelpCircle;
  let bgClass = 'bg-[#FAF9F5] text-[#555F6A] border-[#DDD9CE]';

  switch (provenance) {
    case 'scheduled_verified':
      label = 'Verified Schedule';
      subtext = 'Official railway timetable feed';
      Icon = CheckCircle2;
      bgClass = 'bg-[#EBF4F0] text-[#16432F] border-[#C6DFD4]';
      break;

    case 'estimated':
      label = 'Estimated';
      subtext = 'Calculated from network topology & headway intervals';
      Icon = FileText;
      bgClass = 'bg-[#EBF2F8] text-[#1E4B75] border-[#C2D7E9]';
      break;

    case 'community':
      label = 'Community Reported';
      subtext = 'Submitted by real commuters on ground';
      Icon = Users;
      bgClass = 'bg-[#FAF4EB] text-[#824D00] border-[#E8DAC2]';
      break;

    case 'unavailable':
      label = 'Feed Unavailable';
      subtext = 'Timetable / tracking feed not connected yet';
      Icon = HelpCircle;
      bgClass = 'bg-[#FAF9F5] text-[#555F6A] border-[#DDD9CE]';
      break;

    case 'demo':
      label = 'Internal Test Fixture';
      subtext = 'Reserved for automated test suites';
      Icon = ShieldAlert;
      bgClass = 'bg-[#F2EDFA] text-[#55308D] border-[#DCD0F0]';
      break;
  }

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium tracking-tight ${bgClass}`}
      title={subtext}
    >
      <Icon className={isSmall ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} aria-hidden="true" />
      <span>{label}</span>
      {showDetails && (
        <>
          <span className="opacity-40">·</span>
          <span className="font-normal opacity-85 text-[11px]">{subtext}</span>
        </>
      )}
    </div>
  );
};
