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
export const options = tradeSpikeTest; // You can change this to tradeStressTest or tradeLoadTest

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
  // 1. Get States List (called multiple times in flow)
  let statesResponse = http.get(`${BASE_URL}v1/location/states`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(statesResponse, 'states');
  check(statesResponse, {
    'states status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 2. Get Buyer List
  let buyerListResponse = http.get(`${BASE_URL}v1/trade/buyer_list`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(buyerListResponse, 'buyer_list');
  check(buyerListResponse, {
    'buyer list status is 200': (r) => r.status === 200
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

  // 4. Get Sauda List with Status
  let saudaListResponse = http.get(`${BASE_URL}v1/trade/sauda/list`, {
    headers: COMMON_HEADERS,
    params: {
      sauda_status_id: '1',
      search: '',
      page: '1',
      limit: '50'
    }
  });
  trackMetrics(saudaListResponse, 'sauda_list');
  check(saudaListResponse, {
    'sauda list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 5. Get Sauda Count
  let saudaCountResponse = http.get(`${BASE_URL}v2/trade/sauda/count`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(saudaCountResponse, 'sauda_count');
  check(saudaCountResponse, {
    'sauda count status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 6. Get Sauda Detail
  const saudaId = '35078';
  let saudaDetailResponse = http.get(`${BASE_URL}v2/trade/sauda/detail/${saudaId}`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(saudaDetailResponse, 'sauda_detail');
  check(saudaDetailResponse, {
    'sauda detail status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 7. Get Dispatch List
  let dispatchListResponse = http.get(`${BASE_URL}v3/trade/sauda/dispatch_list/${saudaId}`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(dispatchListResponse, 'dispatch_list');
  check(dispatchListResponse, {
    'dispatch list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 8. Update Sauda
  let updateSaudaResponse = http.patch(`${BASE_URL}v3/trade/sauda`, 
    JSON.stringify({
      trade_sauda_id: 35078,
      quantity: 2000,
      gross_price: 2000,
      cash_discount: 2,
      bag_deduction: 50,
      unloading_charge: 22,
      brokerage: 2,
      farmart_fee: 0,
      net_price: 936,
      discounted_fee: null,
      net_buyer_price: 938,
      master_merchant_id: 5232
    }),
    { headers: COMMON_HEADERS }
  );
  trackMetrics(updateSaudaResponse, 'update_sauda');
  check(updateSaudaResponse, {
    'update sauda status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 9. Change Sauda Status
  let changeSaudaStatusResponse = http.patch(`${BASE_URL}v2/trade/sauda/change_status`,
    JSON.stringify({
      trade_sauda_id: 35078,
      trade_sauda_status: 2,
      master_merchant_id: 5232
    }),
    { headers: COMMON_HEADERS }
  );
  trackMetrics(changeSaudaStatusResponse, 'change_sauda_status');
  check(changeSaudaStatusResponse, {
    'change sauda status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 10. User Role Access Check
  let roleAccessResponse = http.post(`${BASE_URL}v1/role_config/user_role_access`, null, {
    headers: COMMON_HEADERS
  });
  trackMetrics(roleAccessResponse, 'role_access');
  check(roleAccessResponse, {
    'role access status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 11. Get Ticketing Encrypt
  let ticketingResponse = http.get(`${BASE_URL}v1/ticketing/encrypt`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(ticketingResponse, 'ticketing');
  check(ticketingResponse, {
    'ticketing status is 200': (r) => r.status === 200
  });
  sleep(1);
}