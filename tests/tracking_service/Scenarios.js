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
  createTripTrend,
  tripDetailTrend 
} = trends;


export default function () {
  console.log("Config file loaded successfully.");
  
  // Optional: Make a test API call to verify config
  let res = http.get(`${config.BASE_URL}${config.ENDPOINTS.FETCH_STATES}`, {
    headers: config.HEADERS
  });

  console.log(`Response status: ${res.status}`);
}