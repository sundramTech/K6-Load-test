import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics for better reporting
export const errorRate = new Rate('error_rate');
export const successRate = new Rate('success_rate');
export const apiRequestsCounter = new Counter('total_api_requests');

// Common trends that can be used across different tests
export const trends = {
  fetchStateTrend: new Trend('fetch_states_duration'),
  fetchPATrend: new Trend('fetch_pa_duration'),
  tabFrequencyTrend: new Trend('tab_frequency_duration'),
  poDetailsTrend: new Trend('po_details_duration'),
  createTripTrend: new Trend('create_trip_duration'),
  tripDetailTrend: new Trend('trip_detail_duration'),
};

// Enhanced Load Test Configuration
export const loadTest = {
  stages: [
    { duration: '10s', target: 10 },   // Ramp up to 10 users
    { duration: '30s', target: 20 },    // Ramp up to 20 users
    { duration: '1m', target: 20 },    // Stay at 20 users for 3 minutes
    { duration: '10s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<10000'],
    'error_rate': ['rate<49.00'],        // Error rate should be less than 10%
  },
};

// Enhanced Stress Test Configuration
export const stressTest = {
  stages: [
    { duration: '1m', target: 50 },    // Ramp up to 50 users over 1 minute
    { duration: '2m', target: 100 },   // Ramp up to 100 users over 2 minutes
    { duration: '3m', target: 200 },   // Ramp up to 200 users over 3 minutes
    { duration: '5m', target: 200 },   // Stay at 200 users for 5 minutes
    { duration: '2m', target: 100 },   // Ramp down to 100 users
    { duration: '1m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<5000'],
    'error_rate': ['rate<0.2'],        // Error rate should be less than 20% under stress
  },
};

// Enhanced Spike Test Configuration
export const spikeTest = {
  stages: [
    { duration: '30s', target: 20 },   // Normal load
    { duration: '15s', target: 300 },  // Spike to 300 users over 15 seconds
    { duration: '1m', target: 300 },   // Stay at peak for 1 minute
    { duration: '30s', target: 20 },   // Quickly drop back to normal
    { duration: '1m', target: 20 },    // Stay at normal load to see recovery
    { duration: '10s', target: 0 },    // End test
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    'error_rate': ['rate<0.3'],        // Higher tolerance for errors during spike (30%)
  },
}; 
export default function () {
    console.log("Config file loaded successfully.");
    
    // Optional: Make a test API call to verify config
    let res = http.get(`${config.BASE_URL}${config.ENDPOINTS.FETCH_STATES}`, {
      headers: config.HEADERS
    });
  
    console.log(`Response status: ${res.status}`);
  }