import React from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  GitBranch,
} from 'lucide-react';
import { JourneySearchCard } from '../components/planner/JourneySearchCard';
import { CommunityReportsSection } from '../components/community/CommunityReportsSection';
import { CommunityReport } from '../types/transit';
import { MUMBAI_STATIONS } from '../data/mumbaiNetworkData';

interface LandingPageProps {
  onSearch: (originId: string, destinationId: string, time: string, date: string) => void;
  onNavigateToExplore: () => void;
  onOpenTierExplainer: () => void;
  communityReports: CommunityReport[];
  onAddCommunityReport: (report: CommunityReport) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSearch,
  onNavigateToExplore,
  onOpenTierExplainer,
  communityReports,
  onAddCommunityReport,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Search Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16432F] bg-[#EBF4F0] px-2.5 py-1 rounded border border-[#C6DFD4]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Mumbai Suburban Railway Network · Zero Fabricated Data</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E2328] tracking-tight text-balance leading-[1.15]">
                Your smarter Mumbai local commute.
              </h1>

              <p className="text-base sm:text-lg text-[#525B65] leading-relaxed max-w-xl">
                Plan your journey, understand your route, and stay informed with transparent commuter-powered insights.
              </p>
            </div>

            {/* Prominent Journey Search Card */}
            <JourneySearchCard onSearch={onSearch} />

            {/* Quick Suggested Authentic Pairs */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#5E6873]">
              <span className="font-semibold text-[#1E2328]">Popular routes:</span>
              <button
                type="button"
                onClick={() => onSearch('st-ccg', 'st-bvi', '08:30', new Date().toISOString().split('T')[0])}
                className="underline hover:text-[#16432F] cursor-pointer"
              >
                Churchgate → Borivali (WR)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onSearch('st-ccg', 'st-tna', '08:45', new Date().toISOString().split('T')[0])}
                className="underline hover:text-[#16432F] cursor-pointer"
              >
                Churchgate → Thane (Transfer at Dadar)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onSearch('st-csmt', 'st-pnvl', '09:00', new Date().toISOString().split('T')[0])}
                className="underline hover:text-[#16432F] cursor-pointer"
              >
                CSMT → Panvel (HR)
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Transit Atmosphere Image & Network Stat */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#E0DCD2] shadow-sm bg-[#EFECE5]">
              <img
                src="/src/assets/images/mumbai_transit_concourse_1794232170227.jpg"
                alt="Commuters in a modern passenger rail concourse"
                className="w-full h-80 sm:h-96 object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6DFD4]">
                  Commuter Reality
                </span>
                <p className="text-sm font-semibold leading-snug mt-1">
                  7.5 million daily commuters rely on Mumbai locals. LocalLens prioritizes verified network clarity over synthetic guesses.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#DDD9CE] mt-2">
                  <span>Authentic Railway Stations</span>
                  <span>·</span>
                  <span>Verified Interchange Paths</span>
                </div>
              </div>
            </div>

            {/* Network Coverage Strip */}
            <div className="bg-white border border-[#E2DFD6] rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#1E2328]">Mumbai Suburban Rail Coverage</span>
                <p className="text-xs text-[#5D6772]">
                  {MUMBAI_STATIONS.length} verified stations mapped across Western, Central, and Harbour lines.
                </p>
              </div>
              <button
                onClick={onNavigateToExplore}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#16432F] hover:underline shrink-0 cursor-pointer"
              >
                <span>Explore lines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How LocalLens Works Section */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#16432F]">
            Data Integrity Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E2328] tracking-tight">
            How LocalLens works
          </h2>
          <p className="text-sm sm:text-base text-[#525B64] leading-relaxed">
            LocalLens distinguishes verified route structure, timetable parameters, and commuter-reported updates with explicit data provenance. Missing feeds are stated honestly.
          </p>
        </div>

        {/* 3 Transparent Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Journey Planning */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-6 space-y-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#EBF4F0] text-[#16432F] flex items-center justify-center font-bold text-sm">
              <MapPin className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1E2328]">1. Topological Route Planning</h3>
              <p className="text-xs sm:text-sm text-[#555F6A] mt-1.5 leading-relaxed">
                Computes authentic station sequences across Western, Central, and Harbour corridors with verified interchange walking guidance.
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0EDE5] space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#16432F]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Dadar & Kurla footbridge transfer instructions</span>
              </div>
              <div className="flex items-start gap-2 text-[#7D8893]">
                <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A0AAB3]" />
                <span>Live GPS telematics offline until backend integration</span>
              </div>
            </div>
          </div>

          {/* Card 2: Crowd Intelligence */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-6 space-y-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#EBF2F8] text-[#1E4B75] flex items-center justify-center font-bold text-sm">
              <Users className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1E2328]">2. Ground Crowd Intelligence</h3>
              <p className="text-xs sm:text-sm text-[#555F6A] mt-1.5 leading-relaxed">
                Crowd indicators reflect genuine passenger submissions or verified baseline models. When unverified, an honest unavailable state is shown.
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0EDE5] space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#16432F]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Report-backed or verified baseline indicators</span>
              </div>
              <div className="flex items-start gap-2 text-[#7D8893]">
                <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A0AAB3]" />
                <span>Zero fake percentages (e.g. 72% crowded)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Community Reports */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-6 space-y-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#FEF6E7] text-[#8A5300] flex items-center justify-center font-bold text-sm">
              <Clock className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1E2328]">3. Freshness-Governed Reports</h3>
              <p className="text-xs sm:text-sm text-[#555F6A] mt-1.5 leading-relaxed">
                Passenger updates report staircase flow, ticket counter queues, and coach doorway flow. Outdated records are flagged as stale.
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0EDE5] space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#16432F]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>45-minute freshness governance</span>
              </div>
              <div className="flex items-start gap-2 text-[#7D8893]">
                <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A0AAB3]" />
                <span>Zero synthetic or simulated community posts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Data Architecture Section */}
      <section className="bg-white border border-[#E2DFD6] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EDE5]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16432F]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E2328]">
                Trust & Data Standards
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#58626C]">
              How LocalLens strictly classifies transit information to protect commuter trust.
            </p>
          </div>

          <button
            onClick={onOpenTierExplainer}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#16432F] bg-[#FAF9F5] hover:bg-[#EBF4F0] border border-[#C6DFD4] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Full Provenance Policy</span>
          </button>
        </div>

        {/* 4 Trust Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#16432F]">
              <span className="w-2 h-2 rounded-full bg-[#16432F]" />
              <span>1. Verified Schedules vs. Estimates</span>
            </div>
            <p className="text-xs text-[#525B64] leading-relaxed">
              When a verified timetable feed is active, exact minutes are labeled <strong>scheduled_verified</strong>. If trains run on frequency intervals, we present verified parameters without inventing minute-by-minute departure predictions.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1E4B75]">
              <span className="w-2 h-2 rounded-full bg-[#1E4B75]" />
              <span>2. Peer Reports & Crowd Levels</span>
            </div>
            <p className="text-xs text-[#525B64] leading-relaxed">
              Crowd statuses are collected through peer commuter submissions. They are clearly distinguished from statistical time-of-day priors. We never imply that automated coach weight scales or cameras are streaming data.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#8A5300]">
              <span className="w-2 h-2 rounded-full bg-[#8A5300]" />
              <span>3. Explicit Unavailable States</span>
            </div>
            <p className="text-xs text-[#525B64] leading-relaxed">
              If timetable feeds or crowd estimates are absent, we display a prominent <strong>Times Unavailable</strong> or <strong>No recent crowd reports</strong> state. We show verified physical rail alignment rather than blank screens or faked numbers.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#4A5560]">
              <span className="w-2 h-2 rounded-full bg-[#4A5560]" />
              <span>4. Authentic Mumbai Railway Rule</span>
            </div>
            <p className="text-xs text-[#525B64] leading-relaxed">
              LocalLens uses authentic Mumbai Suburban Railway stations and verified railway lines. We never pair station names with synthetic or invented timetable hours.
            </p>
          </div>
        </div>
      </section>

      {/* Community Reports Preview Section */}
      <CommunityReportsSection
        reports={communityReports}
        onAddReport={onAddCommunityReport}
      />
    </div>
  );
};
