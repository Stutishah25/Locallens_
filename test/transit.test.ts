/**
 * Automated Test Suite for LocalLens Mumbai Suburban Transit Architecture
 * Executed via tsx in isolated test harness.
 */

import { MUMBAI_STATIONS, MUMBAI_RAILWAY_LINES } from '../src/data/mumbaiNetworkData';
import { planJourney } from '../src/api/journeysApi';
import { fetchCrowdEstimate } from '../src/api/crowdApi';
import { fetchCommunityReports, submitCommunityReport } from '../src/api/reportsApi';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`PASS: ${testName}`);
    passed++;
  } else {
    console.error(`FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    failed++;
  }
}

async function runTests() {
  console.log('--- STARTING LOCALLENS AUTOMATED TEST SUITE ---\n');

  // Test 1: Authentic Station Dataset Integrity
  const stationIds = new Set<string>();
  const stationCodes = new Set<string>();
  let duplicateIdFound = false;
  let duplicateCodeFound = false;

  for (const s of MUMBAI_STATIONS) {
    if (stationIds.has(s.id)) duplicateIdFound = true;
    if (stationCodes.has(s.code)) duplicateCodeFound = true;
    stationIds.add(s.id);
    stationCodes.add(s.code);
  }

  assert(!duplicateIdFound, 'Station IDs must be completely unique');
  assert(!duplicateCodeFound, 'Station railway telegraphic codes must be completely unique');
  assert(MUMBAI_STATIONS.length >= 35, `Dataset contains authentic Mumbai stations (found ${MUMBAI_STATIONS.length})`);

  // Test 2: Verified Key Interchanges Exist
  const dadar = MUMBAI_STATIONS.find((s) => s.id === 'st-ddr');
  const kurla = MUMBAI_STATIONS.find((s) => s.id === 'st-cla');
  const csmt = MUMBAI_STATIONS.find((s) => s.id === 'st-csmt');

  assert(
    !!dadar && dadar.lineIds.includes('western') && dadar.lineIds.includes('central'),
    'Dadar is verified as Western and Central interchange hub'
  );
  assert(
    !!kurla && kurla.lineIds.includes('central') && kurla.lineIds.includes('harbour'),
    'Kurla is verified as Central and Harbour interchange hub'
  );
  assert(
    !!csmt && csmt.lineIds.includes('central') && csmt.lineIds.includes('harbour'),
    'CSMT is verified as Central and Harbour dual-line terminus'
  );

  // Test 3: Direct Route Planning (Churchgate to Borivali)
  const wrOptions = await planJourney('st-ccg', 'st-bvi');
  assert(wrOptions.length > 0, 'Plan Journey produces direct options for Churchgate -> Borivali');
  const directWr = wrOptions[0];
  assert(directWr.primaryLineId === 'western', 'Direct option uses Western line');
  assert(directWr.interchangesCount === 0, 'Direct option has 0 interchanges');
  assert(directWr.legs[0].intermediateStations.length > 10, 'Includes authentic intermediate stations list');
  assert(
    directWr.timetableStatus === 'unavailable',
    'Timetable status is explicitly unavailable (NO fake timetable departure hours)'
  );
  assert(
    directWr.departureTime === undefined,
    'Departure time is undefined when unverified (NO invented minute departure)'
  );
  assert(
    directWr.liveTrackingAvailable === false,
    'Live train tracking is marked false (NO fake live train positions)'
  );

  // Test 4: Interchange Route Planning (Churchgate to Thane via Dadar)
  const interchangeOptions = await planJourney('st-ccg', 'st-tna');
  assert(interchangeOptions.length > 0, 'Plan Journey produces interchange option for Churchgate -> Thane');
  const dadarInterchange = interchangeOptions.find((o) => o.interchangeStations.includes('Dadar'));
  assert(!!dadarInterchange, 'Route routes through Dadar interchange');
  assert(dadarInterchange?.interchangesCount === 1, 'Records 1 interchange');
  assert(dadarInterchange?.legs.length === 2, 'Constructs 2 legs (Western to Dadar, Central from Dadar to Thane)');
  assert(
    !!dadarInterchange?.legs[0].transferDetails?.footbridgeNotes,
    'Supplies transfer footbridge walking directions at interchange'
  );

  // Test 5: Same Station Validation
  const sameStationOptions = await planJourney('st-ccg', 'st-ccg');
  assert(sameStationOptions.length === 0, 'Origin and Destination matching produces empty array');

  // Test 6: Crowd Intelligence Strict Rule Verification
  const crowd = await fetchCrowdEstimate('st-ddr', 'western');
  assert(
    crowd.summaryText === 'No recent crowd information is available for this journey.',
    'Crowd estimate returns exact honest message when unverified'
  );
  assert(
    crowd.level === 'unavailable',
    'Crowd level is marked unavailable rather than synthetic 72% crowded'
  );

  // Test 7: Community Reports Strict Zero-Fake-Data
  const reports = await fetchCommunityReports();
  assert(Array.isArray(reports) && reports.length === 0, 'Reports starts completely empty (zero fake community posts)');

  // Test 8: Report Submission Transparency
  const submitResult = await submitCommunityReport({
    stationId: 'st-ddr',
    category: 'platform_crowd',
    crowdLevel: 'moderate',
    description: 'Test observation',
  });
  assert(submitResult.isPendingBackend === true, 'Submission transparently marks backend as pending');

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution crashed:', err);
  process.exit(1);
});
