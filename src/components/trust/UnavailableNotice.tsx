import React from 'react';
import { AlertCircle, Clock, ShieldX, Radio } from 'lucide-react';

interface UnavailableNoticeProps {
  type?: 'timetable' | 'sensors' | 'live_gps' | 'crowd' | 'general';
  customMessage?: string;
  className?: string;
}

export const UnavailableNotice: React.FC<UnavailableNoticeProps> = ({
  type = 'timetable',
  customMessage,
  className = '',
}) => {
  let title = 'Information Unavailable';
  let description = customMessage || 'Data feeds for this section are not provided.';
  let Icon = AlertCircle;

  if (type === 'timetable') {
    title = 'Verified Timetable Unavailable';
    description =
      customMessage ||
      'Verified timetable information is not currently available for this journey. Live schedule feeds will be connected when the railway backend API is integrated.';
    Icon = Clock;
  } else if (type === 'live_gps') {
    title = 'Live Train Tracking Offline';
    description =
      customMessage ||
      'Live train tracking is not connected yet. Train positions and real-time running statuses require official GPS telemetry integration.';
    Icon = Radio;
  } else if (type === 'sensors') {
    title = 'Automated Occupancy Sensors Not Available';
    description =
      customMessage ||
      'Mumbai suburban coaches do not have automated weight or sensor-based passenger tracking. LocalLens never fabricates occupancy percentages.';
    Icon = ShieldX;
  } else if (type === 'crowd') {
    title = 'Crowd Information Unavailable';
    description =
      customMessage ||
      'No recent crowd information is available for this journey.';
    Icon = AlertCircle;
  }

  return (
    <div
      className={`bg-[#FAF9F5] border border-[#E4E1D7] rounded-lg p-3.5 sm:p-4 text-xs sm:text-sm text-[#444C54] ${className}`}
      role="status"
    >
      <div className="flex items-start gap-2.5">
        <Icon className="w-4 h-4 text-[#8A5300] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold text-[#1E2328]">{title}</p>
          <p className="text-[#59626A] leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};
