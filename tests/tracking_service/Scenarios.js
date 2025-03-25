import {
  loadTest,
  stressTest,
  spikeTest,
  errorRate,
  successRate,
  trends,
  apiRequestsCounter
} from '../scenarios/GlobalScenarios.js';

// Extend the base configurations with tracking-specific thresholds
export const trackingLoadTest = {
  ...loadTest,
  thresholds: {
    ...loadTest.thresholds,
    'create_trip_duration': ['p(95)<1000'], // 95% of create trip requests should be under 1s
    'trip_detail_duration': ['p(95)<300'],  // 95% of trip details should be under 300ms
  },
};

export const trackingStressTest = {
  ...stressTest,
  thresholds: {
    ...stressTest.thresholds,
    'create_trip_duration': ['p(95)<3000'],
    'trip_detail_duration': ['p(95)<1000'],
  },
};

export const trackingSpikeTest = {
  ...spikeTest,
};

// Re-export needed metrics
export { errorRate, successRate, apiRequestsCounter };
export const { 
  createTripTrend = trends.trend('create_trip_duration'),
  tripDetailTrend = trends.trend('trip_detail_duration')
} = trends;