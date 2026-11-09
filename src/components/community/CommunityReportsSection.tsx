import React, { useState } from 'react';
import { Users, ThumbsUp, Plus, Filter, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CommunityReport, ReportCategory } from '../../types/transit';
import { MUMBAI_STATIONS } from '../../data/mumbaiNetworkData';
import { ProvenanceBadge } from '../trust/ProvenanceBadge';
import { FreshnessLabel } from '../trust/FreshnessLabel';
import { NewReportModal } from './NewReportModal';

interface CommunityReportsSectionProps {
  reports: CommunityReport[];
  onAddReport: (report: CommunityReport) => void;
  className?: string;
  stationFilterId?: string;
}

export const CommunityReportsSection: React.FC<CommunityReportsSectionProps> = ({
  reports,
  onAddReport,
  className = '',
  stationFilterId: initialStationFilter,
}) => {
  const [selectedStation, setSelectedStation] = useState<string>(initialStationFilter || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  const handleToggleUpvote = (id: string) => {
    setUpvotedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredReports = reports.filter((report) => {
    if (selectedStation !== 'all' && report.stationId !== selectedStation) {
      return false;
    }
    if (selectedCategory !== 'all' && report.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <section className={`space-y-5 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1E2328] tracking-tight">
              Commuter Ground Intelligence
            </h2>
            <ProvenanceBadge provenance="community" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-[#555F6A] mt-0.5">
            Real passenger observations on platform stairwells and concourses. Unverified claims and synthetic reports are strictly prohibited.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#16432F] hover:bg-[#1D553C] rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Contribute Platform Update</span>
        </button>
      </div>

      {/* Filter Toolbar (only shown if there are reports or to test filters) */}
      <div className="p-3.5 bg-white border border-[#E2DFD6] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#5A636C] font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Station:</span>
          </div>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF9F5] border border-[#DDD9CE] rounded-md font-medium text-[#1E2328] focus:outline-none focus:ring-1 focus:ring-[#16432F]"
          >
            <option value="all">All Mumbai Stations</option>
            {MUMBAI_STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'platform_crowd', label: 'Platform Flow' },
            { id: 'train_boarding', label: 'Boarding' },
            { id: 'overhead_bridge', label: 'Footbridges' },
            { id: 'ticket_counter', label: 'Ticketing' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#16432F] text-white'
                  : 'bg-[#FAF9F5] text-[#555F6A] hover:text-[#1E2328] border border-[#DDD9CE]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List or Required Empty State */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-8 sm:p-10 bg-white border border-[#E2DFD6] rounded-xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#E2DFD6] text-[#7B858E] flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-[#1E2328]">
                No community reports yet. Be the first to share an update.
              </p>
              <p className="text-xs text-[#5C6670] max-w-md mx-auto leading-relaxed">
                LocalLens does not populate fake passenger posts. When you observe platform conditions at your station, submit a report to help fellow commuters.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#16432F] bg-[#EBF4F0] hover:bg-[#DDEEE6] border border-[#C6DFD4] rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Ground Observation</span>
            </button>
          </div>
        ) : (
          filteredReports.map((report) => {
            const hasUpvoted = upvotedIds[report.id];
            const currentVotes = report.verifiedCount + (hasUpvoted ? 1 : 0);

            return (
              <div
                key={report.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  report.isStale
                    ? 'bg-[#FAF7F6] border-[#EADFD9] opacity-85'
                    : 'bg-white border-[#E2DFD6] hover:border-[#CCD8D1]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#F0EDE5]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#1E2328]">
                      {report.stationName}
                    </span>
                    <span className="text-[#88929C]">·</span>
                    <span className="text-xs font-semibold text-[#16432F] bg-[#EBF4F0] px-2 py-0.5 rounded border border-[#C6DFD4]">
                      {report.categoryLabel}
                    </span>
                    <ProvenanceBadge provenance="community" size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <FreshnessLabel
                      timeAgoText={report.formattedTimeAgo}
                      isStale={report.isStale}
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-2xl">
                    <p className="text-xs sm:text-sm text-[#2C343C] leading-relaxed">
                      {report.description}
                    </p>
                    {report.isStale && (
                      <div className="flex items-center gap-1.5 text-xs text-[#8A4A3B]">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Notice: Submitted over 45 minutes ago. Suburban platform conditions may have changed.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleUpvote(report.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                        hasUpvoted
                          ? 'bg-[#EBF4F0] border-[#C6DFD4] text-[#16432F]'
                          : 'bg-[#FAF9F5] border-[#DDD9CE] text-[#555F6A] hover:bg-[#EFECE5]'
                      }`}
                      title="Confirm this condition matches what you see"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Corroborate ({currentVotes})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <NewReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReport={onAddReport}
      />
    </section>
  );
};
