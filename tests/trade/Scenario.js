import { Trend } from 'k6/metrics';
import {
  loadTest,
  stressTest,
  spikeTest,
  errorRate,
  successRate,
  apiRequestsCounter
} from '../scenarios/GlobalScenarios.js';

// Trade-specific trends
const tradeTrends = {
  // Buyer Price related trends
  buyerListTrend: new Trend('buyer_list_duration'),
  tradeFetchTrend: new Trend('trade_fetch_duration'),
  cropListTrend: new Trend('crop_list_duration'),
  locationAutocompleteTrend: new Trend('location_autocomplete_duration'),
  
  // Supplier Sauda related trends
  saudaListTrend: new Trend('sauda_list_duration'),
  saudaDetailsTrend: new Trend('sauda_details_duration'),
  dispatchListTrend: new Trend('dispatch_list_duration'),
  saudaUpdateTrend: new Trend('sauda_update_duration')
};

// Extend the base configurations with trade-specific thresholds
export const tradeLoadTest = {
  ...loadTest,
  stages: [
    { duration: '10s', target: 15 },   // Ramp up to 15 users
    { duration: '30s', target: 30 },   // Ramp up to 30 users
    { duration: '1m', target: 30 },    // Stay at 30 users for 1 minute
    { duration: '10s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    ...loadTest.thresholds,
    // Buyer Price thresholds
    'buyer_list_duration': ['p(95)<800'],
    'trade_fetch_duration': ['p(95)<1000'],
    'crop_list_duration': ['p(95)<500'],
    'location_autocomplete_duration': ['p(95)<300'],
    
    // Supplier Sauda thresholds
    'sauda_list_duration': ['p(95)<1000'],
    'sauda_details_duration': ['p(95)<800'],
    'dispatch_list_duration': ['p(95)<700'],
    'sauda_update_duration': ['p(95)<1500']
  },
};

export const tradeStressTest = {
  ...stressTest,
  stages: [
    { duration: '1m', target: 40 },    // Ramp up to 40 users
    { duration: '2m', target: 80 },    // Ramp up to 80 users
    { duration: '3m', target: 120 },   // Ramp up to 120 users
    { duration: '5m', target: 120 },   // Stay at 120 users
    { duration: '2m', target: 60 },    // Ramp down to 60 users
    { duration: '1m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    ...stressTest.thresholds,
    // Buyer Price thresholds
    'buyer_list_duration': ['p(95)<2000'],
    'trade_fetch_duration': ['p(95)<2500'],
    'crop_list_duration': ['p(95)<1500'],
    'location_autocomplete_duration': ['p(95)<1000'],
    
    // Supplier Sauda thresholds
    'sauda_list_duration': ['p(95)<2500'],
    'sauda_details_duration': ['p(95)<2000'],
    'dispatch_list_duration': ['p(95)<1800'],
    'sauda_update_duration': ['p(95)<3000']
  },
};

export const tradeSpikeTest = {
  ...spikeTest,
  stages: [
    { duration: '30s', target: 20 },   // Normal load
    { duration: '15s', target: 200 },  // Spike to 200 users
    { duration: '1m', target: 200 },   // Stay at peak
    { duration: '30s', target: 20 },   // Back to normal
    { duration: '1m', target: 20 },    // Stay at normal to verify recovery
    { duration: '10s', target: 0 },    // End test
  ],
  thresholds: {
    ...spikeTest.thresholds,
    // Buyer Price thresholds
    'buyer_list_duration': ['p(95)<3000'],
    'trade_fetch_duration': ['p(95)<3500'],
    'crop_list_duration': ['p(95)<2500'],
    'location_autocomplete_duration': ['p(95)<2000'],
    
    // Supplier Sauda thresholds
    'sauda_list_duration': ['p(95)<3500'],
    'sauda_details_duration': ['p(95)<3000'],
    'dispatch_list_duration': ['p(95)<2800'],
    'sauda_update_duration': ['p(95)<4000']
  },
};

// Re-export needed metrics
export { errorRate, successRate, apiRequestsCounter };

// Export trade-specific trends
export const {
  // Buyer Price trends
  buyerListTrend,
  tradeFetchTrend,
  cropListTrend,
  locationAutocompleteTrend,
  
  // Supplier Sauda trends
  saudaListTrend,
  saudaDetailsTrend,
  dispatchListTrend,
  saudaUpdateTrend
} = tradeTrends;

// Optional: Default export for configuration verification
export default function() {
  console.log("Trade scenarios configuration loaded successfully");
}

function trackMetrics(response, name) {
  const success = response.status === 200;
  errorRate.add(!success);
  successRate.add(success);
  apiRequestsCounter.add(1);
  
  // Add trend tracking based on the operation
  switch(name) {
    case 'buyer_list':
      buyerListTrend.add(response.timings.duration);
      break;
    case 'trade':
      tradeFetchTrend.add(response.timings.duration);
      break;
    // ... add other cases as needed
  }
} 