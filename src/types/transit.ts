/**
 * Transit and data provenance types for LocalLens — Mumbai Suburban Railway
 * Strictly adheres to authentic data representation without synthetic or placeholder values.
 */

export type RailwayLineId = 'western' | 'central' | 'harbour';

export type ProvenanceState = 
  | 'scheduled_verified' // From a verified timetable feed
  | 'estimated'          // Calculation based on verified network parameters
  | 'community'          // Sourced from real commuter submissions
  | 'unavailable'        // Not currently provided by connected data sources
  | 'demo';              // Development/test fixtures only (never shown to users)

export type CrowdLevel = 'low' | 'moderate' | 'high' | 'heavy' | 'unavailable';

export type CrowdConfidence = 'report_backed' | 'baseline_estimate' | 'no_recent_data';

export interface Station {
  id: string;
  name: string;
  code: string;
  lineIds: RailwayLineId[];
  isInterchange: boolean;
  zone: string;
  facilities: string[];
  interchangesWith?: string[]; // e.g. ['Central Line', 'Metro 1']
}

export interface RailwayLine {
  id: RailwayLineId;
  name: string;
  shortCode: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  terminalStations: [string, string];
  corridorDescription: string;
}

export interface JourneyLeg {
  id: string;
  lineId: RailwayLineId;
  fromStationId: string;
  toStationId: string;
  intermediateStations: string[]; // Actual station IDs in traversal order
  stopsCount: number;
  serviceType: 'Slow' | 'Fast';
  provenance: ProvenanceState;
  departureTime?: string; // Only present when scheduled_verified
  arrivalTime?: string;   // Only present when scheduled_verified
  durationMinutes?: number; // Only present when estimated or verified
  transferDetails?: {
    interchangeStationId: string;
    footbridgeNotes: string;
    platforms?: string;
  };
  crowdState: {
    level: CrowdLevel;
    confidence: CrowdConfidence;
    summaryText: string;
    lastUpdatedText?: string;
  };
}

export interface JourneyOption {
  id: string;
  title: string;
  subtitle: string;
  originId: string;
  destinationId: string;
  primaryLineId: RailwayLineId;
  interchangesCount: number;
  interchangeStations: string[];
  legs: JourneyLeg[];
  provenance: ProvenanceState;
  
  // Timings & Durations — optional and undefined when unavailable
  departureTime?: string;
  arrivalTime?: string;
  durationMinutes?: number;
  durationDisplay: string;
  
  // Status & Explanations
  timetableStatus: 'verified' | 'estimated' | 'unavailable';
  timetableNotice?: string;
  liveTrackingAvailable: boolean;
  
  crowdSummary: {
    level: CrowdLevel;
    confidence: CrowdConfidence;
    summaryText: string;
    lastUpdatedText?: string;
  };
}

export type ReportCategory = 
  | 'platform_crowd'
  | 'train_boarding'
  | 'overhead_bridge'
  | 'ticket_counter'
  | 'general_status';

export interface CommunityReport {
  id: string;
  stationId: string;
  stationName: string;
  category: ReportCategory;
  categoryLabel: string;
  crowdLevel: CrowdLevel;
  description: string;
  reportedTimestamp: number; // Unix ms
  formattedTimeAgo: string;
  isStale: boolean;
  provenance: ProvenanceState;
  verifiedCount: number;
}
