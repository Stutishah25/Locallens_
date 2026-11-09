import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  HelpCircle,
  Users,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ProvenanceBadge } from '../components/trust/ProvenanceBadge';
import { CrowdIndicator } from '../components/trust/CrowdIndicator';
import { UnavailableNotice } from '../components/trust/UnavailableNotice';
import { FreshnessLabel } from '../components/trust/FreshnessLabel';
import { DataStateBlock } from '../components/trust/DataStateBlock';

interface TrustPageProps {
  onPlanJourneyClick: () => void;
}

export const TrustPage: React.FC<TrustPageProps> = ({ onPlanJourneyClick }) => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-[#E7E4DC]">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16432F] bg-[#EBF4F0] px-2.5 py-1 rounded border border-[#C6DFD4]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Integrity & Provenance Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2328] tracking-tight">
          Trust & Data Standards
        </h1>
        <p className="text-sm sm:text-base text-[#525B65] leading-relaxed">
          How LocalLens presents Mumbai Suburban Railway information honestly, communicates uncertainty, and prevents commuters from being misled by synthetic or unverified predictions.
        </p>
      </div>

      {/* The 5 Provenance States */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#1E2328]">The Five Provenance States</h2>

        <div className="space-y-4">
          {/* State 1: scheduled_verified */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16432F]" />
                <h3 className="font-bold text-base text-[#1E2328]">
                  1. scheduled_verified
                </h3>
              </div>
              <ProvenanceBadge provenance="scheduled_verified" size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-[#525B64] leading-relaxed">
              Information sourced directly from a verified, permitted official railway timetable feed (e.g. CRIS or zonal railway publishing). When live feeds are not connected, LocalLens marks timetable departures as <strong>unavailable</strong> rather than inventing synthetic clock-time departures.
            </p>
          </div>

          {/* State 2: estimated */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1E4B75]" />
                <h3 className="font-bold text-base text-[#1E2328]">
                  2. estimated
                </h3>
              </div>
              <ProvenanceBadge provenance="estimated" size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-[#525B64] leading-relaxed">
              A genuine calculation or estimate based on actual available network information—such as physical track distance, verified station sequences, and nominal headway frequencies. Never labeled as verified or exact.
            </p>
          </div>

          {/* State 3: community */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#824D00]" />
                <h3 className="font-bold text-base text-[#1E2328]">
                  3. community
                </h3>
              </div>
              <ProvenanceBadge provenance="community" size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-[#525B64] leading-relaxed">
              Information submitted by real users on platforms, footbridges, and booking windows. Crucially, any report older than 45 minutes is automatically branded with a high-visibility <span className="text-[#9E3A24] font-semibold">Stale Warning</span> to ensure passengers never rely on outdated rush-hour conditions.
            </p>
          </div>

          {/* State 4: unavailable */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#555F6A]" />
                <h3 className="font-bold text-base text-[#1E2328]">
                  4. unavailable
                </h3>
              </div>
              <ProvenanceBadge provenance="unavailable" size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-[#525B64] leading-relaxed">
              Information that the application does not currently have. Instead of substituting synthetic placeholders or arbitrary numbers, LocalLens explicitly states: <em>&quot;Verified timetable information is not currently available for this journey&quot;</em> or <em>&quot;Live train tracking is not connected yet.&quot;</em>
            </p>
          </div>

          {/* State 5: demo */}
          <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#55308D]" />
                <h3 className="font-bold text-base text-[#1E2328]">
                  5. demo (Developer Testing Only)
                </h3>
              </div>
              <ProvenanceBadge provenance="demo" size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-[#525B64] leading-relaxed">
              Reserved strictly for automated developer test suites and test harnesses. Under our engineering constitution, demo fixtures are isolated and never displayed to commuters in the live user-facing application.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Trust Components Reference Library */}
      <section className="bg-white border border-[#E2DFD6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-[#1E2328]">
          Trust Component Reference Library
        </h2>
        <p className="text-xs sm:text-sm text-[#525B64]">
          These reusable trust components enforce transparency across every journey card, detail view, and platform update.
        </p>

        <div className="space-y-6 pt-2">
          {/* DataStateBlock Component Examples */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737E88]">
              DataStateBlock Component States
            </span>
            <div className="space-y-2.5">
              <DataStateBlock
                state="scheduled_verified"
                title="Official Timetable Verified"
                description="Verified by railway feed integration."
              />
              <DataStateBlock
                state="estimated"
                title="Topological Alignment Estimate"
                description="Calculated based on confirmed station order."
              />
              <DataStateBlock
                state="unavailable"
                title="Live Train Tracking Offline"
                description="Live train tracking is not connected yet."
              />
            </div>
          </div>

          {/* Provenance Badges showcase */}
          <div className="space-y-2 pt-2 border-t border-[#F0EDE5]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737E88]">
              ProvenanceBadge Variations
            </span>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <ProvenanceBadge provenance="scheduled_verified" showDetails />
              <ProvenanceBadge provenance="estimated" showDetails />
              <ProvenanceBadge provenance="community" showDetails />
              <ProvenanceBadge provenance="unavailable" showDetails />
            </div>
          </div>

          {/* Crowd Indicator 3 States */}
          <div className="space-y-2 pt-2 border-t border-[#F0EDE5]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737E88]">
              Crowd Intelligence (3 Genuine States · No Fake Percentages)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E4E1D7] space-y-1">
                <span className="text-[11px] font-bold text-[#16432F]">State 1: Report-Backed</span>
                <CrowdIndicator
                  level="high"
                  confidence="report_backed"
                  detailed
                  explanation="Corroborated by active passenger platform submissions."
                />
              </div>

              <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E4E1D7] space-y-1">
                <span className="text-[11px] font-bold text-[#1E4B75]">State 2: Baseline Estimate</span>
                <CrowdIndicator
                  level="moderate"
                  confidence="baseline_estimate"
                  detailed
                  explanation="Derived from operational headway intervals."
                />
              </div>

              <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E4E1D7] space-y-1">
                <span className="text-[11px] font-bold text-[#555F6A]">State 3: No Recent Data</span>
                <CrowdIndicator
                  level="unavailable"
                  confidence="no_recent_data"
                  detailed
                />
              </div>
            </div>
          </div>

          {/* Freshness Labels */}
          <div className="space-y-2 pt-2 border-t border-[#F0EDE5]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737E88]">
              Freshness & Stale Indicators
            </span>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <FreshnessLabel timeAgoText="4 mins ago" isStale={false} />
              <FreshnessLabel timeAgoText="18 mins ago" isStale={false} />
              <FreshnessLabel timeAgoText="3 hours ago" isStale={true} />
            </div>
          </div>

          {/* Unavailable Notice Component */}
          <div className="space-y-2 pt-2 border-t border-[#F0EDE5]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737E88]">
              UnavailableNotice Component
            </span>
            <UnavailableNotice
              type="timetable"
              customMessage="Verified timetable information is not currently available for this journey. Live schedule feeds will be connected when the railway backend API is integrated."
            />
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-[#1E2328]">Ready to test the planner?</h3>
          <p className="text-xs text-[#5C6670] mt-0.5">
            Search authentic Mumbai suburban routes across Western, Central, and Harbour lines.
          </p>
        </div>
        <button
          onClick={onPlanJourneyClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16432F] hover:bg-[#1D553C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <span>Launch Journey Planner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
