import React, { useState } from 'react';
import { GitBranch, MapPin, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { MUMBAI_RAILWAY_LINES, MUMBAI_STATIONS } from '../../data/mumbaiNetworkData';
import { RailwayLineId } from '../../types/transit';

interface CorridorNetworkViewProps {
  onSelectStationPair: (fromId: string, toId: string) => void;
}

export const CorridorNetworkView: React.FC<CorridorNetworkViewProps> = ({
  onSelectStationPair,
}) => {
  const [activeLine, setActiveLine] = useState<RailwayLineId>('western');
  const [searchFilter, setSearchFilter] = useState('');

  const selectedLine = MUMBAI_RAILWAY_LINES[activeLine];
  const stationsOnLine = MUMBAI_STATIONS.filter((s) => s.lineIds.includes(activeLine));

  const filteredStations = stationsOnLine.filter(
    (s) =>
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white border border-[#E2DFD6] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDE5]">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#16432F]" />
            <h2 className="text-xl font-bold text-[#1E2328]">Mumbai Suburban Railway Lines</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5A646F] mt-0.5">
            Verified station alignments, transfer junctions, and interchange points across Western, Central, and Harbour corridors.
          </p>
        </div>

        {/* Line Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg">
          {(Object.keys(MUMBAI_RAILWAY_LINES) as RailwayLineId[]).map((lineKey) => {
            const line = MUMBAI_RAILWAY_LINES[lineKey];
            const isActive = activeLine === lineKey;
            return (
              <button
                key={lineKey}
                onClick={() => {
                  setActiveLine(lineKey);
                  setSearchFilter('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'shadow-xs text-white'
                    : 'text-[#5C6670] hover:text-[#1E2328]'
                }`}
                style={{
                  backgroundColor: isActive ? line.color : 'transparent',
                }}
              >
                {line.name.split(' ')[0]} ({line.shortCode})
              </button>
            );
          })}
        </div>
      </div>

      {/* Corridor Summary Banner */}
      <div
        className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
        style={{
          backgroundColor: selectedLine.bgColor,
          borderColor: selectedLine.borderColor,
          color: selectedLine.textColor,
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base">{selectedLine.name}</span>
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-current opacity-85">
              {selectedLine.shortCode}
            </span>
          </div>
          <p className="opacity-90 text-xs mt-1 leading-relaxed max-w-2xl">
            {selectedLine.corridorDescription}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Mumbai Alignment</span>
        </div>
      </div>

      {/* Live Map Telemetry Unavailable Notice */}
      <div className="p-3.5 bg-[#FAF9F5] border border-[#E4E1D7] rounded-lg text-xs text-[#525B64] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#16432F] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Interactive Map Telemetry:</strong> Showing verified railway line alignments and station sequence. Live real-time train positioning markers and GPS speed feeds are offline pending official railway backend API integration.
        </p>
      </div>

      {/* Search Input for Corridor Stations */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A747F]">
          Verified Stations ({filteredStations.length})
        </h3>
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={`Search ${selectedLine.shortCode} stations...`}
          className="px-3 py-1.5 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg text-xs font-medium text-[#1E2328] placeholder-[#8A95A0] focus:outline-none focus:ring-1 focus:ring-[#16432F] w-48 sm:w-64"
        />
      </div>

      {/* Station Alignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredStations.map((station, index) => {
          return (
            <div
              key={station.id}
              className="p-3.5 bg-[#FAF9F5] border border-[#E4E1D7] hover:border-[#CCD8D1] rounded-lg flex items-start justify-between gap-3 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#DDD9CE] text-[11px] font-bold text-[#555F6A] flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-bold text-sm text-[#1E2328]">{station.name}</span>
                  <span className="text-[10px] font-mono text-[#7B858E]">({station.code})</span>
                </div>

                <p className="text-xs text-[#5D6771] pl-7">
                  {station.zone}
                </p>

                <div className="pl-7 pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#69747F]">
                  {station.isInterchange ? (
                    <span className="text-[#16432F] bg-[#EBF4F0] px-1.5 py-0.5 rounded border border-[#C6DFD4] font-semibold">
                      Interchange Hub
                    </span>
                  ) : (
                    <span className="text-[#69747F]">Suburban Station</span>
                  )}
                  {station.interchangesWith && station.interchangesWith.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-[#1E4B75] font-medium">
                        Connects to {station.interchangesWith.join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => onSelectStationPair(station.id, activeLine === 'western' ? 'st-bvi' : 'st-tna')}
                className="p-2 text-[#5C6670] hover:text-[#16432F] hover:bg-white rounded transition-colors shrink-0 cursor-pointer text-xs font-semibold flex items-center gap-1"
                title={`Plan route from ${station.name}`}
              >
                <span>Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
