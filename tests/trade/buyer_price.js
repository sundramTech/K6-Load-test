import { sleep, check } from 'k6';
import http from 'k6/http';
import { 
  tradeLoadTest, 
  tradeStressTest, 
  tradeSpikeTest,
  errorRate,
  successRate,
  apiRequestsCounter 
} from './Scenario.js';

// Test configuration - using scenarios from Scenario.js
export const options = tradeSpikeTest; // You can change this to tradeStressTest or tradeLoadTest based on your needs

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

// Helper function to validate response schema
function validateJsonResponse(response) {
  try {
    const parsedResponse = response.json();
    return typeof parsedResponse === 'object' && parsedResponse !== null;
  } catch (e) {
    return false;
  }
}

// Helper function to track metrics
function trackMetrics(response, name) {
  const success = response.status === 200;
  errorRate.add(!success);
  successRate.add(success);
  apiRequestsCounter.add(1);
}

export default function() {
  // 1. Get Buyer List
  let buyerListResponse = http.get(`${BASE_URL}v1/trade/buyer_list`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(buyerListResponse, 'buyer_list');
  check(buyerListResponse, {
    'buyer list status is 200': (r) => r.status === 200,
    'buyer list response is valid': (r) => validateJsonResponse(r)
  });
  sleep(1);

  // 2. Get States List
  let statesResponse = http.get(`${BASE_URL}v1/location/states`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(statesResponse, 'states');
  check(statesResponse, {
    'states status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 3. Get Crop List
  let cropResponse = http.get(`${BASE_URL}v2/crop`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(cropResponse, 'crop');
  check(cropResponse, {
    'crop status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 4. Get Trade List
  let tradeResponse = http.get(`${BASE_URL}v2/trade`, {
    headers: COMMON_HEADERS,
    params: {
      trade_status: '1',
      search: '',
      page: '1',
      limit: '50'
    }
  });
  trackMetrics(tradeResponse, 'trade');
  check(tradeResponse, {
    'trade status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 5. Get Trade Status Count
  let statusCountResponse = http.get(`${BASE_URL}v1/trade/status/count`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(statusCountResponse, 'status_count');
  check(statusCountResponse, {
    'status count status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 6. Get Trade Rejection Reasons
  let rejectionReasonsResponse = http.get(`${BASE_URL}v1/trade/rejection_reasons`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(rejectionReasonsResponse, 'rejection_reasons');
  check(rejectionReasonsResponse, {
    'rejection reasons status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 7. Get Location Autocomplete
  let locationAutocompleteResponse = http.get(`${BASE_URL}v1/location/auto_complete`, {
    headers: COMMON_HEADERS,
    params: { search_param: '' }
  });
  trackMetrics(locationAutocompleteResponse, 'location_autocomplete');
  check(locationAutocompleteResponse, {
    'location autocomplete status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 8. Get Crop List with Variety
  let cropVarietyResponse = http.get(`${BASE_URL}v2/crop`, {
    headers: COMMON_HEADERS,
    params: { is_variety_required: 'true' }
  });
  trackMetrics(cropVarietyResponse, 'crop_variety');
  check(cropVarietyResponse, {
    'crop variety status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 9. User Role Access Check
  let roleAccessResponse = http.post(`${BASE_URL}v1/role_config/user_role_access`, null, {
    headers: COMMON_HEADERS
  });
  trackMetrics(roleAccessResponse, 'role_access');
  check(roleAccessResponse, {
    'role access status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 10. Get Ticketing Encrypt
  let ticketingResponse = http.get(`${BASE_URL}v1/ticketing/encrypt`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(ticketingResponse, 'ticketing');
  check(ticketingResponse, {
    'ticketing status is 200': (r) => r.status === 200
  });
  sleep(1);
}