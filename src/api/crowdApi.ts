import { CrowdLevel, CrowdConfidence, RailwayLineId } from '../types/transit';
import { apiRequest } from './apiClient';

export interface CrowdEstimateResult {
  level: CrowdLevel;
  confidence: CrowdConfidence;
  summaryText: string;
  stationId: string;
  lineId?: RailwayLineId;
  lastUpdatedText?: string;
  provenance: 'community' | 'estimated' | 'unavailable';
}

/**
 * Fetches crowd estimate for a station and line.
 * If live reports or baselines are not provided by the FastAPI backend,
 * returns an honest unavailable state without fabricated percentages.
 */
export async function fetchCrowdEstimate(
  stationId: string,
  lineId?: RailwayLineId
): Promise<CrowdEstimateResult> {
  try {
    const backendResult = await apiRequest<CrowdEstimateResult>(
      `/crowd?station=${encodeURIComponent(stationId)}${
        lineId ? `&line=${encodeURIComponent(lineId)}` : ''
      }`
    );
    if (backendResult) return backendResult;
  } catch {
    // Expected when backend is not connected yet
  }

  // Honest default state: No fake statistics or percentages
  return {
    stationId,
    lineId,
    level: 'unavailable',
    confidence: 'no_recent_data',
    summaryText: 'No recent crowd information is available for this journey.',
    provenance: 'unavailable',
  };
}
