import { sleep, check } from 'k6';
import http from 'k6/http';
import { 
  tripLoadTest, 
  tripStressTest, 
  tripSpikeTest,
  errorRate,
  successRate,
  apiRequestsCounter 
} from './Scenario.js';

// Test configuration
export const options = tripSpikeTest; // Can be changed to tripStressTest or tripLoadTest

// Base URL and common headers
const BASE_URL = 'https://ml-stage.farmartos.com/';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTdmMDQwYTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzQyNjQ1NTY0fQ.6PQLT4E6xJ-YCSNLGBVpIP8ofT6jSvrhEOuZoUH0rGg';

const COMMON_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7',
  'authorization': AUTH_TOKEN,
  'content-type': 'application/json',
  'origin': 'https://fmt-stage-ml.web.app',
  'referer': 'https://fmt-stage-ml.web.app/'
};

// Helper functions
function validateJsonResponse(response) {
  try {
    const parsedResponse = response.json();
    return typeof parsedResponse === 'object' && parsedResponse !== null;
  } catch (e) {
    return false;
  }
}

function trackMetrics(response, name) {
  const success = response.status === 200;
  errorRate.add(!success);
  successRate.add(success);
  apiRequestsCounter.add(1);
}

export default function() {
  // 1. Fetch All PA
  let paResponse = http.get(`${BASE_URL}v1/campaign/fetch_all_pa`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(paResponse, 'fetch_all_pa');
  check(paResponse, {
    'fetch all PA status is 200': (r) => r.status === 200,
    'fetch all PA response is JSON': (r) => validateJsonResponse(r)
  });
  sleep(1);

  // 2. Fetch All SA
  let saResponse = http.get(`${BASE_URL}v1/users/fetch_all_sa`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(saResponse, 'fetch_all_sa');
  check(saResponse, {
    'fetch all SA status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 3. Get Trip Status List
  let tripStatusResponse = http.get(`${BASE_URL}v1/trip_tracking/trip_status_list`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(tripStatusResponse, 'trip_status_list');
  check(tripStatusResponse, {
    'trip status list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 4. Get States List
  let statesResponse = http.get(`${BASE_URL}v1/location/states`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(statesResponse, 'states_list');
  check(statesResponse, {
    'states list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 5. Get Purchase Order Deliveries for Different Tabs
  const tabNames = [0, 1, 2, 3, 4, 5, 6];
  for (let tabName of tabNames) {
    let deliveriesResponse = http.get(`${BASE_URL}v4/purchase_order/deliveries`, {
      headers: COMMON_HEADERS,
      params: {
        tab_name: tabName.toString(),
        page: '1',
        limit: '50',
        search_params: ''
      }
    });
    trackMetrics(deliveriesResponse, `deliveries_tab_${tabName}`);
    check(deliveriesResponse, {
      [`deliveries tab ${tabName} status is 200`]: (r) => r.status === 200,
      [`deliveries tab ${tabName} response is valid`]: (r) => validateJsonResponse(r)
    });
    sleep(1);
  }

  // 6. Get Tab Count
  let tabCountResponse = http.get(`${BASE_URL}v4/purchase_order/tab_count`, {
    headers: COMMON_HEADERS,
    params: {
      search_params: ''
    }
  });
  trackMetrics(tabCountResponse, 'tab_count');
  check(tabCountResponse, {
    'tab count status is 200': (r) => r.status === 200
  });
  sleep(1);
}