import { Trend } from 'k6/metrics';
import {
  loadTest,
  stressTest,
  spikeTest,
  errorRate,
  successRate,
  apiRequestsCounter
} from '../scenarios/GlobalScenarios.js';

// Trip tracking-specific trends
const tripTrends = {
  // Internal API trends
  paFetchTrend: new Trend('pa_fetch_duration'),
  saFetchTrend: new Trend('sa_fetch_duration'),
  tripStatusListTrend: new Trend('trip_status_list_duration'),
  deliveriesTabTrend: new Trend('deliveries_tab_duration'),
  tabCountTrend: new Trend('tab_count_duration'),
  
  // External API trends
  tripDetailsTrend: new Trend('trip_details_duration'),
  mapDirectionTrend: new Trend('map_direction_duration'),
  locationDetailsTrend: new Trend('location_details_duration'),
  sentryMonitoringTrend: new Trend('sentry_monitoring_duration')
};

// Extend the base configurations with trip-specific thresholds
export const tripLoadTest = {
  ...loadTest,
  stages: [
    { duration: '10s', target: 15 },   // Ramp up to 15 users
    { duration: '30s', target: 25 },   // Ramp up to 25 users
    { duration: '1m', target: 25 },    // Stay at 25 users for 1 minute
    { duration: '10s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    ...loadTest.thresholds,
    // Internal API thresholds
    'pa_fetch_duration': ['p(95)<800'],
    'sa_fetch_duration': ['p(95)<800'],
    'trip_status_list_duration': ['p(95)<500'],
    'deliveries_tab_duration': ['p(95)<1000'],
    'tab_count_duration': ['p(95)<300'],
    
    // External API thresholds
    'trip_details_duration': ['p(95)<1500'],
    'map_direction_duration': ['p(95)<2000'],
    'location_details_duration': ['p(95)<1000'],
    'sentry_monitoring_duration': ['p(95)<500']
  },
};

export const tripStressTest = {
  ...stressTest,
  stages: [
    { duration: '1m', target: 35 },    // Ramp up to 35 users
    { duration: '2m', target: 70 },    // Ramp up to 70 users
    { duration: '3m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 50 },    // Ramp down to 50 users
    { duration: '1m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    ...stressTest.thresholds,
    // Internal API thresholds under stress
    'pa_fetch_duration': ['p(95)<2000'],
    'sa_fetch_duration': ['p(95)<2000'],
    'trip_status_list_duration': ['p(95)<1500'],
    'deliveries_tab_duration': ['p(95)<2500'],
    'tab_count_duration': ['p(95)<1000'],
    
    // External API thresholds under stress
    'trip_details_duration': ['p(95)<3000'],
    'map_direction_duration': ['p(95)<4000'],
    'location_details_duration': ['p(95)<2500'],
    'sentry_monitoring_duration': ['p(95)<1500']
  },
};

export const tripSpikeTest = {
  ...spikeTest,
  stages: [
    { duration: '30s', target: 20 },   // Normal load
    { duration: '15s', target: 180 },  // Spike to 180 users
    { duration: '1m', target: 180 },   // Stay at peak
    { duration: '30s', target: 20 },   // Back to normal
    { duration: '1m', target: 20 },    // Stay at normal to verify recovery
    { duration: '10s', target: 0 },    // End test
  ],
  thresholds: {
    ...spikeTest.thresholds,
    // Internal API thresholds during spike
    'pa_fetch_duration': ['p(95)<3000'],
    'sa_fetch_duration': ['p(95)<3000'],
    'trip_status_list_duration': ['p(95)<2500'],
    'deliveries_tab_duration': ['p(95)<3500'],
    'tab_count_duration': ['p(95)<2000'],
    
    // External API thresholds during spike
    'trip_details_duration': ['p(95)<4000'],
    'map_direction_duration': ['p(95)<5000'],
    'location_details_duration': ['p(95)<3500'],
    'sentry_monitoring_duration': ['p(95)<2500']
  },
};

// Re-export needed metrics
export { errorRate, successRate, apiRequestsCounter };

// Export trip-specific trends
export const {
  // Internal API trends
  paFetchTrend,
  saFetchTrend,
  tripStatusListTrend,
  deliveriesTabTrend,
  tabCountTrend,
  
  // External API trends
  tripDetailsTrend,
  mapDirectionTrend,
  locationDetailsTrend,
  sentryMonitoringTrend
} = tripTrends;

// Optional: Default export for configuration verification
export default function() {
  console.log("Trip tracking scenarios configuration loaded successfully");
}

function trackMetrics(response, name) {
  const success = response.status === 200;
  errorRate.add(!success);
  successRate.add(success);
  apiRequestsCounter.add(1);
  
  // Add trend tracking based on the operation
  switch(name) {
    case 'fetch_all_pa':
      paFetchTrend.add(response.timings.duration);
      break;
    case 'fetch_all_sa':
      saFetchTrend.add(response.timings.duration);
      break;
    case 'trip_status_list':
      tripStatusListTrend.add(response.timings.duration);
      break;
    case 'trip_details':
      tripDetailsTrend.add(response.timings.duration);
      break;
    case 'origin_to_dest_direction':
    case 'dest_to_origin_direction':
      mapDirectionTrend.add(response.timings.duration);
      break;
    case 'location_details':
      locationDetailsTrend.add(response.timings.duration);
      break;
    case 'sentry_monitoring':
      sentryMonitoringTrend.add(response.timings.duration);
      break;
    default:
      if (name.startsWith('deliveries_tab_')) {
        deliveriesTabTrend.add(response.timings.duration);
      }
      break;
  }
} 