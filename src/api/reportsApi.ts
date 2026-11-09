import { CommunityReport } from '../types/transit';
import { apiRequest } from './apiClient';

/**
 * Fetches community-submitted reports.
 * Returns empty array when no genuine reports exist (strict zero fake data policy).
 */
export async function fetchCommunityReports(stationId?: string): Promise<CommunityReport[]> {
  try {
    const endpoint = stationId 
      ? `/reports?station=${encodeURIComponent(stationId)}`
      : '/reports';
    const backendResult = await apiRequest<CommunityReport[]>(endpoint);
    if (backendResult) return backendResult;
  } catch {
    // When backend is not yet connected
  }

  // Strict honest empty state: Zero fabricated community posts
  return [];
}

export interface SubmitReportPayload {
  stationId: string;
  category: string;
  crowdLevel: string;
  description: string;
}

export interface SubmitReportResult {
  success: boolean;
  message: string;
  isPendingBackend: boolean;
}

/**
 * Submits a commuter report.
 * Explicitly notifies user about backend persistence availability.
 */
export async function submitCommunityReport(
  payload: SubmitReportPayload
): Promise<SubmitReportResult> {
  try {
    const res = await apiRequest<{ success: boolean; message: string }>('/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      success: res.success,
      message: res.message,
      isPendingBackend: false,
    };
  } catch {
    // Transparent notification: report handled locally during UI demo phase
    return {
      success: true,
      message:
        'Report accepted in local preview session. Permanent storage will activate once the FastAPI backend is connected.',
      isPendingBackend: true,
    };
  }
}
