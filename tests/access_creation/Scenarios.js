import { Trend } from 'k6/metrics';
import { 
  loadTest, 
  stressTest, 
  spikeTest, 
  errorRate, 
  successRate, 
  apiRequestsCounter 
} from '../scenarios/GlobalScenarios.js';

// Define access creation specific trends
const accessTrends = {
  userListTrend: new Trend('user_list_duration'),
  statesListTrend: new Trend('states_list_duration'),
  designationsTrend: new Trend('designations_duration'),
  rmListTrend: new Trend('rm_list_duration'),
  mobileCheckTrend: new Trend('mobile_check_duration'),
  employeeIdCheckTrend: new Trend('employee_id_check_duration'),
  districtsListTrend: new Trend('districts_list_duration'),
  userCreationTrend: new Trend('user_creation_duration')
};

// Access creation load test configuration
export const accessLoadTest = {
  ...loadTest,
  stages: [
    { duration: '1m', target: 10 },    // Ramp up to 10 users
    { duration: '3m', target: 20 },    // Stay at 20 users
    { duration: '1m', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    ...loadTest.thresholds,
    'user_list_duration': ['p(95)<1000'],           // 1s for user list
    'states_list_duration': ['p(95)<500'],          // 500ms for states
    'designations_duration': ['p(95)<500'],         // 500ms for designations
    'rm_list_duration': ['p(95)<800'],             // 800ms for RM list
    'mobile_check_duration': ['p(95)<500'],        // 500ms for mobile check
    'employee_id_check_duration': ['p(95)<500'],   // 500ms for employee ID check
    'districts_list_duration': ['p(95)<500'],      // 500ms for districts
    'user_creation_duration': ['p(95)<2000'],      // 2s for user creation
    'http_req_failed': ['rate<0.01'],             // Less than 1% errors
    'http_req_duration': ['p(95)<2000']           // 95% of requests within 2s
  }
};

// Access creation stress test configuration
export const accessStressTest = {
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
    'user_list_duration': ['p(95)<2000'],          // 2s under stress
    'states_list_duration': ['p(95)<1000'],        // 1s under stress
    'designations_duration': ['p(95)<1000'],       // 1s under stress
    'rm_list_duration': ['p(95)<1500'],           // 1.5s under stress
    'mobile_check_duration': ['p(95)<1000'],      // 1s under stress
    'employee_id_check_duration': ['p(95)<1000'], // 1s under stress
    'districts_list_duration': ['p(95)<1000'],    // 1s under stress
    'user_creation_duration': ['p(95)<3000'],     // 3s under stress
    'http_req_failed': ['rate<0.05'],            // Less than 5% errors
    'http_req_duration': ['p(95)<3000']          // 95% of requests within 3s
  }
};

// Access creation spike test configuration
export const accessSpikeTest = {
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
    'user_list_duration': ['p(95)<3000'],          // 3s during spike
    'states_list_duration': ['p(95)<1500'],        // 1.5s during spike
    'designations_duration': ['p(95)<1500'],       // 1.5s during spike
    'rm_list_duration': ['p(95)<2000'],           // 2s during spike
    'mobile_check_duration': ['p(95)<1500'],      // 1.5s during spike
    'employee_id_check_duration': ['p(95)<1500'], // 1.5s during spike
    'districts_list_duration': ['p(95)<1500'],    // 1.5s during spike
    'user_creation_duration': ['p(95)<4000'],     // 4s during spike
    'http_req_failed': ['rate<0.10'],            // Less than 10% errors
    'http_req_duration': ['p(95)<4000']          // 95% of requests within 4s
  }
};

// Re-export metrics
export { errorRate, successRate, apiRequestsCounter };

// Export access creation specific trends
export const {
  userListTrend,
  statesListTrend,
  designationsTrend,
  rmListTrend,
  mobileCheckTrend,
  employeeIdCheckTrend,
  districtsListTrend,
  userCreationTrend
} = accessTrends; 