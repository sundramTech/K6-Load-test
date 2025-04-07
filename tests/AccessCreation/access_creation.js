import { sleep, check } from 'k6';
import http from 'k6/http';
import { 
  accessLoadTest, 
  accessStressTest, 
  accessSpikeTest,
  errorRate,
  successRate,
  apiRequestsCounter,
  userListTrend,
  statesListTrend,
  designationsTrend,
  rmListTrend,
  mobileCheckTrend,
  employeeIdCheckTrend,
  districtsListTrend,
  userCreationTrend
} from './Scenarios.js';

// Test configuration
export const options = accessLoadTest; // Can be changed to accessStressTest or accessSpikeTest

// Base URL and common headers
const BASE_URL = 'https://ml-stage.farmartos.com/';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTdmMDUwMDU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThkMzFlNWE4Njg3ZmM0Njg2NmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3ODI4IiwiaWF0IjoxNzQyODE0NTQzfQ.8WheI3mMGClRQKy-wGHDUb1z4_hx9p4zGWgNERoz-Sw';

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
  
  // Add specific trend tracking
  switch(name) {
    case 'user_list':
      userListTrend.add(response.timings.duration);
      break;
    case 'states_list':
      statesListTrend.add(response.timings.duration);
      break;
    case 'designations':
      designationsTrend.add(response.timings.duration);
      break;
    case 'rm_list':
      rmListTrend.add(response.timings.duration);
      break;
    case 'mobile_check':
      mobileCheckTrend.add(response.timings.duration);
      break;
    case 'employee_id_check':
      employeeIdCheckTrend.add(response.timings.duration);
      break;
    case 'districts_list':
      districtsListTrend.add(response.timings.duration);
      break;
    case 'user_creation':
      userCreationTrend.add(response.timings.duration);
      break;
  }
}

export default function() {
  // 1. Get User List
  let userListResponse = http.get(`${BASE_URL}v2/user`, {
    headers: COMMON_HEADERS,
    params: {
      page_no: '1',
      limit: '100'
    }
  });
  trackMetrics(userListResponse, 'user_list');
  check(userListResponse, {
    'user list status is 200': (r) => r.status === 200,
    'user list response is JSON': (r) => validateJsonResponse(r)
  });
  sleep(1);

  // 2. Get States List
  let statesResponse = http.get(`${BASE_URL}v1/location/states`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(statesResponse, 'states_list');
  check(statesResponse, {
    'states list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 3. Get Designations
  let designationsResponse = http.get(`${BASE_URL}v2/user/designations`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(designationsResponse, 'designations');
  check(designationsResponse, {
    'designations status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 4. Get RM List
  let rmResponse = http.get(`${BASE_URL}v2/user/rm`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(rmResponse, 'rm_list');
  check(rmResponse, {
    'RM list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 5. Check Mobile Number
  let mobileCheckResponse = http.get(`${BASE_URL}v2/user/mobile_number_check`, {
    headers: COMMON_HEADERS,
    params: {
      mobile_number: '7687678687'
    }
  });
  trackMetrics(mobileCheckResponse, 'mobile_check');
  check(mobileCheckResponse, {
    'mobile check status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 6. Check Employee ID
  let employeeIdCheckResponse = http.get(`${BASE_URL}v2/user/employee_id_check/FM908`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(employeeIdCheckResponse, 'employee_id_check');
  check(employeeIdCheckResponse, {
    'employee ID check status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 7. Get Districts
  let districtsResponse = http.get(`${BASE_URL}v1/location/districts`, {
    headers: COMMON_HEADERS,
    params: {
      master_state_id: '35'
    }
  });
  trackMetrics(districtsResponse, 'districts_list');
  check(districtsResponse, {
    'districts list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 8. Create User
  let createUserPayload = {
    user_name: "Sundram SDET",
    mobile_number: "7687678687",
    employee_id: "FM908",
    designation_id: 11,
    state_ids: [35],
    district_ids: [525],
    reporting_manager_id: 2,
    status_of_employee: 1
  };

  let createUserResponse = http.post(`${BASE_URL}v2/user/panel`,
    JSON.stringify(createUserPayload),
    {
      headers: COMMON_HEADERS
    }
  );
  trackMetrics(createUserResponse, 'user_creation');
  check(createUserResponse, {
    'user creation status is 200': (r) => r.status === 200,
    'user creation response is JSON': (r) => validateJsonResponse(r)
  });
  sleep(1);
}
