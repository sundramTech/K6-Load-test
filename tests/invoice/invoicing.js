import { sleep, check } from 'k6';
import http from 'k6/http';
import { 
  invoiceLoadTest, 
  invoiceStressTest, 
  invoiceSpikeTest,
  errorRate,
  successRate,
  apiRequestsCounter,
  paListTrend,
  saListTrend,
  tabsCountTrend,
  invoiceListTrend
} from './Scenarios.js';

// Test configuration
export const options = invoiceLoadTest; // Can be changed to invoiceStressTest or invoiceSpikeTest

// Base URL and common headers
const BASE_URL = 'https://ml-stage.farmartos.com/';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTdmMDQwYTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzQyODE1MDY0fQ.ad3XSd4AnpfTS7g3Ha_VbFgxEnCmXL1YGBEDkpkC6Xs';

const COMMON_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7',
  'authorization': AUTH_TOKEN,
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
    case 'pa_list':
      paListTrend.add(response.timings.duration);
      break;
    case 'sa_list':
      saListTrend.add(response.timings.duration);
      break;
    case 'tabs_count':
      tabsCountTrend.add(response.timings.duration);
      break;
    case 'invoice_list':
      invoiceListTrend.add(response.timings.duration);
      break;
  }
}

export default function() {
  // 1. Get PA List
  let paListResponse = http.get(`${BASE_URL}v1/auto_invoice/pa_list`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(paListResponse, 'pa_list');
  check(paListResponse, {
    'PA list status is 200': (r) => r.status === 200,
    'PA list response is JSON': (r) => validateJsonResponse(r)
  });
  sleep(1);

  // 2. Get SA List
  let saListResponse = http.get(`${BASE_URL}v1/auto_invoice/sa_list`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(saListResponse, 'sa_list');
  check(saListResponse, {
    'SA list status is 200': (r) => r.status === 200,
    'SA list response is JSON': (r) => validateJsonResponse(r)
  });
  sleep(1);

  // 3. Test different invoice status combinations
  const statusCombinations = [
    '7',            // Single status
    '4',            // Single status
    '6',            // Single status
    '5, 8',        // Multiple statuses
    '5,4,6, 8'     // All statuses
  ];

  for (let status of statusCombinations) {
    // Get Invoice List
    let invoiceListResponse = http.get(`${BASE_URL}v1/auto_invoice/list`, {
      headers: COMMON_HEADERS,
      params: {
        page: '1',
        limit: '25',
        status: status
      }
    });
    trackMetrics(invoiceListResponse, 'invoice_list');
    check(invoiceListResponse, {
      [`Invoice list status ${status} is 200`]: (r) => r.status === 200,
      [`Invoice list status ${status} response is JSON`]: (r) => validateJsonResponse(r)
    });
    sleep(1);

    // Get Tabs Count
    let tabsCountResponse = http.get(`${BASE_URL}v1/auto_invoice/tabs_count/`, {
      headers: COMMON_HEADERS,
      params: {
        page: '1',
        limit: '25',
        status: status,
        search_by: ''
      }
    });
    trackMetrics(tabsCountResponse, 'tabs_count');
    check(tabsCountResponse, {
      [`Tabs count status ${status} is 200`]: (r) => r.status === 200,
      [`Tabs count status ${status} response is JSON`]: (r) => validateJsonResponse(r)
    });
    sleep(1);
  }
}
