import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'landing' | 'planner' | 'explore' | 'trust') => void;
  onOpenExplainer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenExplainer }) => {
  return (
    <footer className="bg-[#FAF9F5] border-t border-[#E5E2DA] mt-20 text-xs text-[#525B65]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#EAE7DF]">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#16432F] text-white flex items-center justify-center font-bold text-xs">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-[#1E2328] tracking-tight">
                LocalLens
              </span>
            </div>
            <p className="text-xs text-[#5C6671] max-w-md leading-relaxed">
              Intelligent, trust-first commuting platform designed for Mumbai suburban rail passengers. Providing verifiable route structure, transparent crowd models, and commuter-backed observations.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#16432F] font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Student Engineering Demonstration · Mock Data Prototype</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E2328]">
              Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-[#16432F] transition-colors cursor-pointer"
                >
                  Commute Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-[#16432F] transition-colors cursor-pointer"
                >
                  Journey Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#16432F] transition-colors cursor-pointer"
                >
                  Network & Corridors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trust')}
                  className="hover:text-[#16432F] transition-colors cursor-pointer"
                >
                  Provenance & Standards
                </button>
              </li>
            </ul>
          </div>

          {/* Trust Standards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E2328]">
              Data Provenance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenExplainer}
                  className="hover:text-[#16432F] transition-colors cursor-pointer text-left"
                >
                  Tier A / B / C Methodology
                </button>
              </li>
              <li>
                <span className="text-[#78828D]">Fictional Demo Corridors</span>
              </li>
              <li>
                <span className="text-[#78828D]">Prior vs Community Crowds</span>
              </li>
              <li>
                <span className="text-[#78828D]">Stale Report Governance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Official Railway Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6B7580]">
          <p className="leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> LocalLens is an independent commuter information project. Always verify important travel information through official railway channels (Western Railway, Central Railway, and UTS mobile ticketing).
          </p>
          <div className="text-[11px] shrink-0 text-[#858E97]">
            LocalLens Prototype © 2026
          </div>
        </div>
      </div>
    </footer>
  );
};
