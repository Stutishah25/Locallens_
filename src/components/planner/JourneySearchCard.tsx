import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Search, Calendar, Clock, MapPin, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { Station, RailwayLineId } from '../../types/transit';
import { fetchStations, fetchRailwayLines } from '../../api/stationsApi';
import { MUMBAI_STATIONS, MUMBAI_RAILWAY_LINES } from '../../data/mumbaiNetworkData';

interface JourneySearchCardProps {
  initialOriginId?: string;
  initialDestinationId?: string;
  initialTime?: string;
  onSearch: (originId: string, destinationId: string, time: string, date: string) => void;
  className?: string;
}

export const JourneySearchCard: React.FC<JourneySearchCardProps> = ({
  initialOriginId = 'st-ccg', // Churchgate
  initialDestinationId = 'st-bvi', // Borivali
  initialTime = '08:30',
  onSearch,
  className = '',
}) => {
  const [stations, setStations] = useState<Station[]>(MUMBAI_STATIONS);
  const [lines, setLines] = useState(MUMBAI_RAILWAY_LINES);

  const [originId, setOriginId] = useState(initialOriginId);
  const [destinationId, setDestinationId] = useState(initialDestinationId);
  const [time, setTime] = useState(initialTime);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Autocomplete search states
  const [originQuery, setOriginQuery] = useState(() => {
    return MUMBAI_STATIONS.find((s) => s.id === initialOriginId)?.name || 'Churchgate';
  });
  const [destQuery, setDestQuery] = useState(() => {
    return MUMBAI_STATIONS.find((s) => s.id === initialDestinationId)?.name || 'Borivali';
  });

  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Load stations and lines through API layer
  useEffect(() => {
    let mounted = true;
    Promise.all([fetchStations(), fetchRailwayLines()]).then(([loadedStations, loadedLines]) => {
      if (mounted) {
        setStations(loadedStations);
        setLines(loadedLines);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setIsOriginOpen(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setIsDestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOriginStations = stations.filter((s) =>
    s.name.toLowerCase().includes(originQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(originQuery.toLowerCase()) ||
    s.zone.toLowerCase().includes(originQuery.toLowerCase())
  );

  const filteredDestStations = stations.filter((s) =>
    s.name.toLowerCase().includes(destQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(destQuery.toLowerCase()) ||
    s.zone.toLowerCase().includes(destQuery.toLowerCase())
  );

  const handleSwapStations = () => {
    const tempId = originId;
    const tempQuery = originQuery;

    setOriginId(destinationId);
    setOriginQuery(destQuery);

    setDestinationId(tempId);
    setDestQuery(tempQuery);
    setValidationError(null);
  };

  const handleSelectOrigin = (station: Station) => {
    setOriginId(station.id);
    setOriginQuery(station.name);
    setIsOriginOpen(false);
    setValidationError(null);
  };

  const handleSelectDest = (station: Station) => {
    setDestinationId(station.id);
    setDestQuery(station.name);
    setIsDestOpen(false);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation
    if (!originId || !originQuery.trim()) {
      setValidationError('Please select an authentic Mumbai departure station.');
      return;
    }
    if (!destinationId || !destQuery.trim()) {
      setValidationError('Please select an authentic Mumbai destination station.');
      return;
    }
    if (originId === destinationId) {
      setValidationError('Origin and destination stations cannot be the same station.');
      return;
    }
    if (!date) {
      setValidationError('Please specify a valid travel date.');
      return;
    }
    if (!time) {
      setValidationError('Please specify a departure time.');
      return;
    }

    setValidationError(null);
    onSearch(originId, destinationId, time, date);
  };

  const renderLineBadges = (lineIds: RailwayLineId[]) => (
    <div className="flex items-center gap-1">
      {lineIds.map((lId) => {
        const line = lines[lId];
        if (!line) return null;
        return (
          <span
            key={lId}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
            style={{
              backgroundColor: line.bgColor,
              borderColor: line.borderColor,
              color: line.textColor,
            }}
            title={line.name}
          >
            {line.shortCode}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className={`bg-white border border-[#E4E1D7] rounded-xl shadow-xs p-5 sm:p-7 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Origin and Destination with Swap */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Origin Autocomplete */}
          <div ref={originRef} className="relative">
            <label className="block text-xs font-semibold text-[#3E4750] uppercase tracking-wider mb-1.5">
              From Station (Origin)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#16432F]">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={originQuery}
                onChange={(e) => {
                  setOriginQuery(e.target.value);
                  setIsOriginOpen(true);
                  setValidationError(null);
                }}
                onFocus={() => setIsOriginOpen(true)}
                placeholder="Search Mumbai station (e.g. Churchgate, Dadar)..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg text-sm font-medium text-[#1E2328] placeholder-[#8A95A0] focus:outline-none focus:ring-2 focus:ring-[#16432F]/20 focus:border-[#16432F] transition-all"
                aria-label="Origin Mumbai station"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setIsOriginOpen(!isOriginOpen)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78838E] hover:text-[#1E2328] cursor-pointer"
                aria-label="Toggle origin station list"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown menu */}
            {isOriginOpen && (
              <div className="absolute z-30 mt-1.5 w-full bg-white border border-[#DDD9CE] rounded-lg shadow-lg max-h-64 overflow-y-auto py-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#7E8893] uppercase tracking-wider bg-[#FAF9F5] border-b border-[#EFECE5]">
                  Authentic Mumbai Suburban Stations ({filteredOriginStations.length})
                </div>
                {filteredOriginStations.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-[#7E8893] text-center">
                    No matching Mumbai suburban stations found
                  </div>
                ) : (
                  filteredOriginStations.map((station) => (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => handleSelectOrigin(station)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#F5F8F6] flex items-center justify-between text-xs transition-colors cursor-pointer border-b border-[#F5F4F0] last:border-none"
                    >
                      <div className="flex flex-col pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#1E2328]">{station.name}</span>
                          <span className="text-[11px] font-mono text-[#7B858E]">({station.code})</span>
                        </div>
                        <span className="text-[11px] text-[#636E78]">
                          {station.zone} {station.isInterchange ? '· Interchange Hub' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {renderLineBadges(station.lineIds)}
                        {station.id === originId && (
                          <Check className="w-3.5 h-3.5 text-[#16432F] ml-1" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1 lg:my-0">
            <button
              type="button"
              onClick={handleSwapStations}
              className="p-2.5 text-[#444D55] hover:text-[#16432F] bg-[#FAF9F5] hover:bg-[#EBF4F0] border border-[#DDD9CE] hover:border-[#C6DFD4] rounded-lg transition-all transform active:scale-95 cursor-pointer mt-4 lg:mt-5"
              aria-label="Swap origin and destination stations"
              title="Swap origin and destination stations"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Autocomplete */}
          <div ref={destRef} className="relative">
            <label className="block text-xs font-semibold text-[#3E4750] uppercase tracking-wider mb-1.5">
              To Station (Destination)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#16432F]">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  setIsDestOpen(true);
                  setValidationError(null);
                }}
                onFocus={() => setIsDestOpen(true)}
                placeholder="Search Mumbai station (e.g. Borivali, Thane)..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg text-sm font-medium text-[#1E2328] placeholder-[#8A95A0] focus:outline-none focus:ring-2 focus:ring-[#16432F]/20 focus:border-[#16432F] transition-all"
                aria-label="Destination Mumbai station"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setIsDestOpen(!isDestOpen)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78838E] hover:text-[#1E2328] cursor-pointer"
                aria-label="Toggle destination station list"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown menu */}
            {isDestOpen && (
              <div className="absolute z-30 mt-1.5 w-full bg-white border border-[#DDD9CE] rounded-lg shadow-lg max-h-64 overflow-y-auto py-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#7E8893] uppercase tracking-wider bg-[#FAF9F5] border-b border-[#EFECE5]">
                  Authentic Mumbai Suburban Stations ({filteredDestStations.length})
                </div>
                {filteredDestStations.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-[#7E8893] text-center">
                    No matching Mumbai suburban stations found
                  </div>
                ) : (
                  filteredDestStations.map((station) => (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => handleSelectDest(station)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#F5F8F6] flex items-center justify-between text-xs transition-colors cursor-pointer border-b border-[#F5F4F0] last:border-none"
                    >
                      <div className="flex flex-col pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#1E2328]">{station.name}</span>
                          <span className="text-[11px] font-mono text-[#7B858E]">({station.code})</span>
                        </div>
                        <span className="text-[11px] text-[#636E78]">
                          {station.zone} {station.isInterchange ? '· Interchange Hub' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {renderLineBadges(station.lineIds)}
                        {station.id === destinationId && (
                          <Check className="w-3.5 h-3.5 text-[#16432F] ml-1" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date, Time, and Submit Button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[#3E4750] uppercase tracking-wider mb-1.5">
              Travel Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A7580]">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setValidationError(null);
                }}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg text-xs sm:text-sm font-medium text-[#1E2328] focus:outline-none focus:ring-2 focus:ring-[#16432F]/20 focus:border-[#16432F]"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold text-[#3E4750] uppercase tracking-wider mb-1.5">
              Departure Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A7580]">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setValidationError(null);
                }}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg text-xs sm:text-sm font-medium text-[#1E2328] focus:outline-none focus:ring-2 focus:ring-[#16432F]/20 focus:border-[#16432F]"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#16432F] hover:bg-[#1D553C] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              <span>Plan Journey</span>
            </button>
          </div>
        </div>

        {validationError && (
          <div className="p-3 bg-[#FDF0ED] border border-[#F5D0C6] rounded-lg text-xs text-[#9E3A24] font-medium flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </form>
    </div>
  );
};
