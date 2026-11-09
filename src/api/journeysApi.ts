import {
  JourneyOption,
  JourneyLeg,
  Station,
  RailwayLineId,
} from '../types/transit';
import {
  MUMBAI_STATIONS,
  WESTERN_LINE_ORDER,
  CENTRAL_LINE_ORDER,
  HARBOUR_LINE_ORDER,
} from '../data/mumbaiNetworkData';
import { apiRequest } from './apiClient';

/**
 * Helper to slice sequential intermediate stations along a corridor
 */
function getIntermediateStations(
  lineOrder: string[],
  startId: string,
  endId: string
): string[] {
  const startIndex = lineOrder.indexOf(startId);
  const endIndex = lineOrder.indexOf(endId);

  if (startIndex === -1 || endIndex === -1) return [];

  if (startIndex < endIndex) {
    // Forward direction (South to North)
    return lineOrder.slice(startIndex + 1, endIndex);
  } else {
    // Reverse direction (North to South)
    return lineOrder.slice(endIndex + 1, startIndex).reverse();
  }
}

/**
 * Plans journey between two verified Mumbai Suburban Railway stations.
 * Queries future FastAPI backend; falls back to verified topological route construction.
 * Strictly adheres to the NO FAKE DATA rule by explicitly reporting timetable and crowd feeds as unavailable.
 */
export async function planJourney(
  originId: string,
  destinationId: string,
  _departureTime: string = '08:30',
  _travelDate: string = ''
): Promise<JourneyOption[]> {
  try {
    const backendResult = await apiRequest<JourneyOption[]>(
      `/journeys?origin=${encodeURIComponent(originId)}&destination=${encodeURIComponent(
        destinationId
      )}`
    );
    if (backendResult && backendResult.length > 0) {
      return backendResult;
    }
  } catch {
    // Expected when FastAPI backend is not yet running
  }

  const origin = MUMBAI_STATIONS.find((s) => s.id === originId);
  const dest = MUMBAI_STATIONS.find((s) => s.id === destinationId);

  if (!origin || !dest || origin.id === dest.id) {
    return [];
  }

  const options: JourneyOption[] = [];

  // Check 1: Direct line match
  const commonLines = origin.lineIds.filter((l) => dest.lineIds.includes(l));

  if (commonLines.includes('western')) {
    const stops = getIntermediateStations(WESTERN_LINE_ORDER, origin.id, dest.id);
    const leg: JourneyLeg = {
      id: `leg-wr-${origin.id}-${dest.id}`,
      lineId: 'western',
      fromStationId: origin.id,
      toStationId: dest.id,
      intermediateStations: stops,
      stopsCount: stops.length + 1,
      serviceType: 'Slow',
      provenance: 'unavailable',
      crowdState: {
        level: 'unavailable',
        confidence: 'no_recent_data',
        summaryText: 'No recent crowd information is available for this journey.',
      },
    };

    options.push({
      id: `opt-direct-wr-${origin.id}-${dest.id}`,
      title: 'Direct Western Line Route',
      subtitle: `${origin.name} to ${dest.name} without train interchange`,
      originId: origin.id,
      destinationId: dest.id,
      primaryLineId: 'western',
      interchangesCount: 0,
      interchangeStations: [],
      legs: [leg],
      provenance: 'unavailable',
      timetableStatus: 'unavailable',
      timetableNotice:
        'Verified timetable information is not currently available for this journey. Live train schedule feeds will be connected in the FastAPI backend phase.',
      durationDisplay: 'Timetable feed unavailable',
      liveTrackingAvailable: false,
      crowdSummary: {
        level: 'unavailable',
        confidence: 'no_recent_data',
        summaryText: 'No recent crowd information is available for this journey.',
      },
    });
  }

  if (commonLines.includes('central')) {
    const stops = getIntermediateStations(CENTRAL_LINE_ORDER, origin.id, dest.id);
    const leg: JourneyLeg = {
      id: `leg-cr-${origin.id}-${dest.id}`,
      lineId: 'central',
      fromStationId: origin.id,
      toStationId: dest.id,
      intermediateStations: stops,
      stopsCount: stops.length + 1,
      serviceType: 'Slow',
      provenance: 'unavailable',
      crowdState: {
        level: 'unavailable',
        confidence: 'no_recent_data',
        summaryText: 'No recent crowd information is available for this journey.',
      },
    };

    options.push({
      id: `opt-direct-cr-${origin.id}-${dest.id}`,
      title: 'Direct Central Line Route',
      subtitle: `${origin.name} to ${dest.name} on Central Railway Mainline`,
      originId: origin.id,
      destinationId: dest.id,
      primaryLineId: 'central',
      interchangesCount: 0,
      interchangeStations: [],
      legs: [leg],
      provenance: 'unavailable',
      timetableStatus: 'unavailable',
      timetableNotice:
        'Verified timetable information is not currently available for this journey. Live train schedule feeds will be connected in the FastAPI backend phase.',
      durationDisplay: 'Timetable feed unavailable',
      liveTrackingAvailable: false,
      crowdSummary: {
        level: 'unavailable',
        confidence: 'no_recent_data',
        summaryText: 'No recent crowd information is available for this journey.',
      },
    });
  }

  if (commonLines.includes('harbour')) {
    const stops = getIntermediateStations(HARBOUR_LINE_ORDER, origin.id, dest.id);
    const leg: JourneyLeg = {
      id: `leg-hr-${origin.id}-${dest.id}`,
      lineId: 'harbour',
      fromStationId: origin.id,
      toStationId: dest.id,
      intermediateStations: stops,
      stopsCount: stops.length + 1,
      serviceType: 'Slow',
      provenance: 'unavailable',
      crowdState: {
        level: 'unavailable',
        confidence: 'no_recent_data',
        summaryText: 'No recent crowd information is available for this journey.',
      },
    };

    options.push({
      id: `opt-direct-hr-${origin.id}-${dest.id}`,
      title: 'Direct Harbour Line Route',
      subtitle: `${origin.name} to ${dest.name} on Harbour Suburban Corridor`,
      originId: origin.id,
      destinationId: dest.id,
      primaryLineId: 'harbour',
      interchangesCount: 0,
      interchangeStations: [],
      legs: [leg],
      provenance: 'unavailable',
      timetableStatus: 'unavailable',
      timetableNotice:
        'Verified timetable information is not currently available for this journey. Live train schedule feeds will be connected in the FastAPI backend phase.',
      durationDisplay: 'Timetable feed unavailable',
      liveTrackingAvailable: false,
      crowdSummary: {
        level: 'unavailable',
        confidence: 'no_recent_data',
        summaryText: 'No recent crowd information is available for this journey.',
      },
    });
  }

  // Check 2: Cross-network route via verified Interchange (e.g. Dadar or Kurla)
  if (options.length === 0) {
    const isOriginWR = origin.lineIds.includes('western');
    const isDestCR = dest.lineIds.includes('central');
    const isOriginCR = origin.lineIds.includes('central');
    const isDestWR = dest.lineIds.includes('western');

    // Case A: Western <-> Central via Dadar
    if ((isOriginWR && isDestCR) || (isOriginCR && isDestWR)) {
      const dadarId = 'st-ddr';
      const isFromWR = isOriginWR;

      const leg1Stops = isFromWR
        ? getIntermediateStations(WESTERN_LINE_ORDER, origin.id, dadarId)
        : getIntermediateStations(CENTRAL_LINE_ORDER, origin.id, dadarId);

      const leg2Stops = isFromWR
        ? getIntermediateStations(CENTRAL_LINE_ORDER, dadarId, dest.id)
        : getIntermediateStations(WESTERN_LINE_ORDER, dadarId, dest.id);

      const leg1: JourneyLeg = {
        id: `leg-1-interchange-${origin.id}-dadar`,
        lineId: isFromWR ? 'western' : 'central',
        fromStationId: origin.id,
        toStationId: dadarId,
        intermediateStations: leg1Stops,
        stopsCount: leg1Stops.length + 1,
        serviceType: 'Slow',
        provenance: 'unavailable',
        transferDetails: {
          interchangeStationId: dadarId,
          footbridgeNotes:
            'Use Middle Footbridge or Tilak Bridge to transfer between Western Railway platforms and Central Railway platforms. Allow approximately 5–7 minutes for walking traversal.',
          platforms: isFromWR
            ? 'Western Line Platform to Central Line Platform'
            : 'Central Line Platform to Western Line Platform',
        },
        crowdState: {
          level: 'unavailable',
          confidence: 'no_recent_data',
          summaryText: 'No recent crowd information is available for this journey.',
        },
      };

      const leg2: JourneyLeg = {
        id: `leg-2-interchange-dadar-${dest.id}`,
        lineId: isFromWR ? 'central' : 'western',
        fromStationId: dadarId,
        toStationId: dest.id,
        intermediateStations: leg2Stops,
        stopsCount: leg2Stops.length + 1,
        serviceType: 'Slow',
        provenance: 'unavailable',
        crowdState: {
          level: 'unavailable',
          confidence: 'no_recent_data',
          summaryText: 'No recent crowd information is available for this journey.',
        },
      };

      options.push({
        id: `opt-interchange-dadar-${origin.id}-${dest.id}`,
        title: 'Interchange Route via Dadar',
        subtitle: `Transfer at Dadar between ${isFromWR ? 'Western' : 'Central'} and ${
          isFromWR ? 'Central' : 'Western'
        } lines`,
        originId: origin.id,
        destinationId: dest.id,
        primaryLineId: isFromWR ? 'western' : 'central',
        interchangesCount: 1,
        interchangeStations: ['Dadar'],
        legs: [leg1, leg2],
        provenance: 'unavailable',
        timetableStatus: 'unavailable',
        timetableNotice:
          'Verified timetable information is not currently available for this journey. Live train schedule feeds will be connected in the FastAPI backend phase.',
        durationDisplay: 'Timetable feed unavailable',
        liveTrackingAvailable: false,
        crowdSummary: {
          level: 'unavailable',
          confidence: 'no_recent_data',
          summaryText: 'No recent crowd information is available for this journey.',
        },
      });
    }

    // Case B: Central <-> Harbour via Kurla
    const isOriginHR = origin.lineIds.includes('harbour');
    const isDestHR = dest.lineIds.includes('harbour');

    if ((isOriginCR && isDestHR) || (isOriginHR && isDestCR)) {
      const kurlaId = 'st-cla';
      const isFromCR = isOriginCR;

      const leg1Stops = isFromCR
        ? getIntermediateStations(CENTRAL_LINE_ORDER, origin.id, kurlaId)
        : getIntermediateStations(HARBOUR_LINE_ORDER, origin.id, kurlaId);

      const leg2Stops = isFromCR
        ? getIntermediateStations(HARBOUR_LINE_ORDER, kurlaId, dest.id)
        : getIntermediateStations(CENTRAL_LINE_ORDER, kurlaId, dest.id);

      const leg1: JourneyLeg = {
        id: `leg-1-interchange-${origin.id}-kurla`,
        lineId: isFromCR ? 'central' : 'harbour',
        fromStationId: origin.id,
        toStationId: kurlaId,
        intermediateStations: leg1Stops,
        stopsCount: leg1Stops.length + 1,
        serviceType: 'Slow',
        provenance: 'unavailable',
        transferDetails: {
          interchangeStationId: kurlaId,
          footbridgeNotes:
            'Use Middle Footbridge to transfer between Central Mainline platforms (1-6) and Harbour Line elevated platforms (7-8). Allow approximately 4–6 minutes walking.',
          platforms: isFromCR
            ? 'Central Mainline Platform to Harbour Elevated Platform 7/8'
            : 'Harbour Elevated Platform 7/8 to Central Mainline Platform 1-6',
        },
        crowdState: {
          level: 'unavailable',
          confidence: 'no_recent_data',
          summaryText: 'No recent crowd information is available for this journey.',
        },
      };

      const leg2: JourneyLeg = {
        id: `leg-2-interchange-kurla-${dest.id}`,
        lineId: isFromCR ? 'harbour' : 'central',
        fromStationId: kurlaId,
        toStationId: dest.id,
        intermediateStations: leg2Stops,
        stopsCount: leg2Stops.length + 1,
        serviceType: 'Slow',
        provenance: 'unavailable',
        crowdState: {
          level: 'unavailable',
          confidence: 'no_recent_data',
          summaryText: 'No recent crowd information is available for this journey.',
        },
      };

      options.push({
        id: `opt-interchange-kurla-${origin.id}-${dest.id}`,
        title: 'Interchange Route via Kurla',
        subtitle: `Transfer at Kurla between ${isFromCR ? 'Central' : 'Harbour'} and ${
          isFromCR ? 'Harbour' : 'Central'
        } lines`,
        originId: origin.id,
        destinationId: dest.id,
        primaryLineId: isFromCR ? 'central' : 'harbour',
        interchangesCount: 1,
        interchangeStations: ['Kurla'],
        legs: [leg1, leg2],
        provenance: 'unavailable',
        timetableStatus: 'unavailable',
        timetableNotice:
          'Verified timetable information is not currently available for this journey. Live train schedule feeds will be connected in the FastAPI backend phase.',
        durationDisplay: 'Timetable feed unavailable',
        liveTrackingAvailable: false,
        crowdSummary: {
          level: 'unavailable',
          confidence: 'no_recent_data',
          summaryText: 'No recent crowd information is available for this journey.',
        },
      });
    }
  }

  return options;
}
