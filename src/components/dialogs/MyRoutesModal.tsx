import React from 'react';
import { X, Bookmark, ArrowRight, Trash2, Clock, CheckCircle } from 'lucide-react';
import { JourneyOption } from '../../types/transit';
import { MUMBAI_STATIONS, MUMBAI_RAILWAY_LINES } from '../../data/mumbaiNetworkData';
import { ProvenanceBadge } from '../trust/ProvenanceBadge';

interface MyRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRoutes: JourneyOption[];
  onSelectRoute: (journey: JourneyOption) => void;
  onRemoveRoute: (journeyId: string) => void;
}

export const MyRoutesModal: React.FC<MyRoutesModalProps> = ({
  isOpen,
  onClose,
  savedRoutes,
  onSelectRoute,
  onRemoveRoute,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-routes-title"
    >
      <div className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-xl max-w-xl w-full shadow-xl p-6 sm:p-7 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E4DB]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#16432F]" />
            <h2 id="my-routes-title" className="text-base font-bold text-[#1E2328]">
              Saved Mumbai Routes ({savedRoutes.length})
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

        {/* Content */}
        <div className="py-4 overflow-y-auto space-y-3 flex-1">
          {savedRoutes.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EBF4F0] text-[#16432F] flex items-center justify-center mx-auto">
                <Bookmark className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-[#1E2328]">No Saved Routes Yet</p>
              <p className="text-xs text-[#5D6772] max-w-sm mx-auto">
                Bookmark your daily Mumbai suburban routes from the journey planner to quickly re-plan across Churchgate, Dadar, Borivali, CSMT, or Thane.
              </p>
            </div>
          ) : (
            savedRoutes.map((journey) => {
              const origin = MUMBAI_STATIONS.find((s) => s.id === journey.originId);
              const dest = MUMBAI_STATIONS.find((s) => s.id === journey.destinationId);
              const line = MUMBAI_RAILWAY_LINES[journey.primaryLineId] || MUMBAI_RAILWAY_LINES.western;

              return (
                <div
                  key={journey.id}
                  className="p-4 bg-white border border-[#E2DFD6] hover:border-[#CCD8D1] rounded-xl transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-sm text-[#1E2328]">
                        <span>{origin?.name || 'Origin'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#737E88]" />
                        <span>{dest?.name || 'Destination'}</span>
                      </div>
                      <p className="text-xs text-[#5E6771] mt-0.5">{journey.title}</p>
                    </div>

                    <ProvenanceBadge provenance={journey.provenance} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-[#F0EDE5]">
                    <div className="flex items-center gap-2 text-[#565F69]">
                      <span className="font-semibold text-[#16432F]">{line.shortCode}</span>
                      <span>·</span>
                      <span>{journey.interchangesCount === 0 ? 'Direct Route' : 'Via Interchange'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveRoute(journey.id)}
                        className="p-1.5 text-[#7D8893] hover:text-[#9E3A24] rounded transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectRoute(journey);
                          onClose();
                        }}
                        className="px-3 py-1 bg-[#16432F] hover:bg-[#1D553C] text-white font-medium text-xs rounded transition-colors cursor-pointer"
                      >
                        Plan Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E7E4DB] flex justify-between items-center text-xs text-[#6A747F]">
          <span>Saved locally in browser</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-[#1E2328] hover:bg-[#EFECE5] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
