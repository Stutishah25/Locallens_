import { Station, RailwayLine, RailwayLineId } from '../types/transit';
import { MUMBAI_STATIONS, MUMBAI_RAILWAY_LINES } from '../data/mumbaiNetworkData';
import { apiRequest } from './apiClient';

/**
 * Fetches all authentic Mumbai suburban railway stations.
 * First queries future FastAPI backend; falls back to verified station dataset.
 */
export async function fetchStations(): Promise<Station[]> {
  try {
    return await apiRequest<Station[]>('/stations');
  } catch {
    // Verified network fallback when backend is not yet running
    return MUMBAI_STATIONS;
  }
}

/**
 * Fetches single station by ID or telegraphic code.
 */
export async function fetchStationById(idOrCode: string): Promise<Station | null> {
  const normalized = idOrCode.toLowerCase().trim();
  try {
    return await apiRequest<Station>(`/stations/${encodeURIComponent(normalized)}`);
  } catch {
    const station = MUMBAI_STATIONS.find(
      (s) => s.id.toLowerCase() === normalized || s.code.toLowerCase() === normalized
    );
    return station || null;
  }
}

/**
 * Fetches all railway lines and metadata.
 */
export async function fetchRailwayLines(): Promise<Record<RailwayLineId, RailwayLine>> {
  try {
    return await apiRequest<Record<RailwayLineId, RailwayLine>>('/lines');
  } catch {
    return MUMBAI_RAILWAY_LINES;
  }
}
