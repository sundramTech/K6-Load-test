import { Trend } from 'k6/metrics';
import { 
  loadTest, 
  stressTest, 
  spikeTest, 
  errorRate, 
  successRate, 
  apiRequestsCounter 
} from '../Scenarios/GlobalScenarios.js';

// Define invoice specific trends
const invoiceTrends = {
  paListTrend: new Trend('pa_list_duration'),
  saListTrend: new Trend('sa_list_duration'),
  tabsCountTrend: new Trend('tabs_count_duration'),
  invoiceListTrend: new Trend('invoice_list_duration')
};

// Invoice load test configuration
export const invoiceLoadTest = {
  ...loadTest,
  stages: [
    { duration: '1m', target: 10 },    // Ramp up to 10 users
    { duration: '3m', target: 20 },    // Stay at 20 users
    { duration: '1m', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    ...loadTest.thresholds,
    'pa_list_duration': ['p(95)<1000'],        // 1s for PA list
    'sa_list_duration': ['p(95)<1000'],        // 1s for SA list
    'tabs_count_duration': ['p(95)<500'],      // 500ms for tabs count
    'invoice_list_duration': ['p(95)<1500'],   // 1.5s for invoice list
    'http_req_failed': ['rate<0.01'],          // Less than 1% errors
    'http_req_duration': ['p(95)<2000']        // 95% of requests within 2s
  }
};

// Invoice stress test configuration
export const invoiceStressTest = {
  ...stressTest,
  stages: [
    { duration: '2m', target: 30 },    // Ramp up to 30 users
    { duration: '5m', target: 60 },    // Stay at 60 users
    { duration: '2m', target: 80 },    // Ramp up to 80 users
    { duration: '5m', target: 80 },    // Stay at 80 users
    { duration: '2m', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    ...stressTest.thresholds,
    'pa_list_duration': ['p(95)<2000'],        // 2s under stress
    'sa_list_duration': ['p(95)<2000'],        // 2s under stress
    'tabs_count_duration': ['p(95)<1000'],     // 1s under stress
    'invoice_list_duration': ['p(95)<3000'],   // 3s under stress
    'http_req_failed': ['rate<0.05'],          // Less than 5% errors
    'http_req_duration': ['p(95)<3000']        // 95% of requests within 3s
  }
};

// Invoice spike test configuration
export const invoiceSpikeTest = {
  ...spikeTest,
  stages: [
    { duration: '1m', target: 20 },     // Baseline
    { duration: '30s', target: 100 },   // Spike to 100 users
    { duration: '1m', target: 100 },    // Stay at spike
    { duration: '30s', target: 20 },    // Recovery
    { duration: '2m', target: 20 },     // Verify stability
    { duration: '30s', target: 0 },     // Scale down
  ],
  thresholds: {
    ...spikeTest.thresholds,
    'pa_list_duration': ['p(95)<3000'],        // 3s during spike
    'sa_list_duration': ['p(95)<3000'],        // 3s during spike
    'tabs_count_duration': ['p(95)<2000'],     // 2s during spike
    'invoice_list_duration': ['p(95)<4000'],   // 4s during spike
    'http_req_failed': ['rate<0.10'],          // Less than 10% errors
    'http_req_duration': ['p(95)<4000']        // 95% of requests within 4s
  }
};

// Re-export metrics
export { errorRate, successRate, apiRequestsCounter };

// Export invoice specific trends
export const {
  paListTrend,
  saListTrend,
  tabsCountTrend,
  invoiceListTrend
} = invoiceTrends; 