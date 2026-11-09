import React, { useState } from 'react';
import { X, Users, AlertCircle, Check, Info } from 'lucide-react';
import { CommunityReport, CrowdLevel, ReportCategory } from '../../types/transit';
import { MUMBAI_STATIONS } from '../../data/mumbaiNetworkData';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newReport: CommunityReport) => void;
}

export const NewReportModal: React.FC<NewReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [stationId, setStationId] = useState(MUMBAI_STATIONS[0].id);
  const [category, setCategory] = useState<ReportCategory>('platform_crowd');
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('moderate');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const station = MUMBAI_STATIONS.find((s) => s.id === stationId);
    const categoryLabels: Record<ReportCategory, string> = {
      platform_crowd: 'Platform Flow / Density',
      train_boarding: 'Coach Doorway / Boarding',
      overhead_bridge: 'Foot Overbridge / Stairwell',
      ticket_counter: 'Ticket Window / ATVM Queue',
      general_status: 'Concourse / Station Premises',
    };

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      stationId,
      stationName: station?.name || 'Mumbai Station',
      category,
      categoryLabel: categoryLabels[category],
      crowdLevel,
      description: description.trim(),
      reportedTimestamp: Date.now(),
      formattedTimeAgo: 'Just now',
      isStale: false,
      provenance: 'community',
      verifiedCount: 1,
    };

    onSubmitReport(newReport);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-xl max-w-lg w-full shadow-xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E4DB]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#16432F]" />
            <h2 id="report-modal-title" className="text-base font-bold text-[#1E2328]">
              Contribute a Commuter Ground Observation
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

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#EBF4F0] text-[#16432F] flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#1E2328]">Report Added to Active Session</p>
            <p className="text-xs text-[#525B64] max-w-sm mx-auto">
              Your observation is active for this session. Permanent storage will be enabled when the FastAPI backend and commuter authentication are connected.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs sm:text-sm">
            {/* Backend connection transparency notice */}
            <div className="p-3 bg-[#FAF4EB] border border-[#EADBCC] rounded-lg text-xs text-[#7A4B00] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#8A5300] shrink-0 mt-0.5" />
              <p>
                <strong>Backend Integration Notice:</strong> Commuter accounts and persistent server storage will become available when the FastAPI backend is connected. In this frontend phase, submissions update your active session.
              </p>
            </div>

            {/* Station Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#3C444C] mb-1">
                Mumbai Suburban Station
              </label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg text-xs sm:text-sm font-medium text-[#1E2328] focus:outline-none focus:ring-2 focus:ring-[#16432F]/20 focus:border-[#16432F]"
              >
                {MUMBAI_STATIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) — {s.zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#3C444C] mb-1">
                Report Topic
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg text-xs sm:text-sm font-medium text-[#1E2328] focus:outline-none focus:ring-2 focus:ring-[#16432F]/20 focus:border-[#16432F]"
              >
                <option value="platform_crowd">Platform Flow / Density</option>
                <option value="train_boarding">Coach Doorway / Boarding Conditions</option>
                <option value="overhead_bridge">Foot Overbridge / Stairwell Congestion</option>
                <option value="ticket_counter">Ticket Counter / ATVM Queues</option>
                <option value="general_status">Concourse / General Station Flow</option>
              </select>
            </div>

            {/* Crowd Level */}
            <div>
              <label className="block text-xs font-semibold text-[#3C444C] mb-1.5">
                Observed Platform / Train Condition
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'low', label: 'Light Flow' },
                  { id: 'moderate', label: 'Moderate' },
                  { id: 'high', label: 'Dense Flow' },
                  { id: 'heavy', label: 'Heavy Rush' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCrowdLevel(lvl.id as CrowdLevel)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      crowdLevel === lvl.id
                        ? 'bg-[#16432F] text-white border-[#16432F]'
                        : 'bg-white text-[#4A535C] border-[#DDD9CE] hover:bg-[#F5F8F6]'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#3C444C] mb-1">
                Specific Commuter Observation
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Middle Footbridge stairwell towards Platform 3 is moving smoothly. Light queue at ticket windows."
                className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg text-xs sm:text-sm font-normal text-[#1E2328] placeholder-[#88939D] focus:outline-none focus:ring-2 focus:ring-[#16432F]/20 focus:border-[#16432F]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E7E4DB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#5A636C] hover:text-[#1E2328] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#16432F] hover:bg-[#1D553C] disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
              >
                Post Observation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
