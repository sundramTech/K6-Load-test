import { sleep, check } from 'k6';
import http from 'k6/http';
import { 
  poLoadTest, 
  poStressTest, 
  poSpikeTest,
  errorRate,
  successRate,
  fetchStateTrend,
  fetchPATrend,
  tabFrequencyTrend,
  poDetailsTrend,
  apiRequestsCounter 
} from './Scenario.js';

// Test configuration - using scenarios from Scenario.js
export const options = poSpikeTest; // You can change this to poStressTest or poLoadTest based on your needs

// Base URL and common headers
const BASE_URL = 'https://dev-ml.farmartos.com/';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ';

const COMMON_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.9',
  'authorization': AUTH_TOKEN,
  'origin': 'https://fmt-dev-ml.web.app',
  'referer': 'https://fmt-dev-ml.web.app/',
  'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
};

// Helper function to validate response schema - fixed to properly handle JSON validation
function validateJsonResponse(response) {
  try {
    const parsedResponse = response.json();
    return typeof parsedResponse === 'object' && parsedResponse !== null;
  } catch (e) {
    return false;
  }
}

// Helper function to safely check properties in arrays
function safeArrayCheck(arr, validationFn) {
  return Array.isArray(arr) && arr.length > 0 && arr.every(validationFn);
}

export default function() {
  // 1. Fetch States
  let startTime = new Date();
  let statesResponse = http.get(`${BASE_URL}v1/location/states`, {
    headers: COMMON_HEADERS,
  });
  fetchStateTrend.add(new Date() - startTime);
  apiRequestsCounter.add(1);
  
  let stateSuccess = check(statesResponse, {
    'states status is 200': (r) => r.status === 200,
    'states response is JSON': (r) => validateJsonResponse(r),
    'states has expected fields': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body) && body.length > 0 && body.every(state => 
          'id' in state && 
          'name' in state && 
          'state_code' in state
        );
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!stateSuccess);
  successRate.add(stateSuccess);
  sleep(1);

  // 2. Fetch All PA
  startTime = new Date();
  let paResponse = http.get(`${BASE_URL}v1/campaign/fetch_all_pa`, {
    headers: COMMON_HEADERS,
  });
  fetchPATrend.add(new Date() - startTime);
  apiRequestsCounter.add(1);
  
  let paSuccess = check(paResponse, {
    'PA status is 200': (r) => r.status === 200,
    'PA response is JSON': (r) => validateJsonResponse(r),
    'PA has expected fields': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body) && body.length > 0 && body.every(pa => 
          'id' in pa && 
          'name' in pa
        );
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!paSuccess);
  successRate.add(paSuccess);
  sleep(1);

  // 3. Tab Frequency API
  startTime = new Date();
  let tabFreqResponse = http.get(`${BASE_URL}v1/master_sample/tab_frequency`, {
    headers: COMMON_HEADERS,
    params: {
      business_type: '3',
      pa_ids: '109,176',
      rpm_ids: '253',
      state_ids: '5',
      po_created_from_date: '2024-10-23',
      po_created_to_date: '2024-10-24'
    }
  });
  tabFrequencyTrend.add(new Date() - startTime);
  apiRequestsCounter.add(1);

  let tabFreqSuccess = check(tabFreqResponse, {
    'tab frequency status is 200': (r) => r.status === 200,
    'tab frequency response is JSON': (r) => validateJsonResponse(r),
    'tab frequency has expected structure': (r) => {
      try {
        const body = r.json();
        return typeof body === 'object' && body !== null &&
               'total_count' in body &&
               'data' in body;
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!tabFreqSuccess);
  successRate.add(tabFreqSuccess);
  sleep(1);

  // 4. PO Approve Details
  let poApproveResponse = http.get(`${BASE_URL}v1/master_sample/po_to_approve_details`, {
    headers: COMMON_HEADERS,
    params: { lot_id: '6715' }
  });
  let poApproveSuccess = check(poApproveResponse, {
    'PO approve details status is 200': (r) => r.status === 200,
    'PO approve details response is JSON': (r) => validateJsonResponse(r),
    'PO approve details has expected fields': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'lot_id' in body &&
               'po_details' in body;
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!poApproveSuccess);
  successRate.add(poApproveSuccess);
  sleep(1);

  // 5. PO Mapping Transaction Details
  let poMappingResponse = http.get(`${BASE_URL}v1/master_sample/po_mapping_transaction_details`, {
    headers: COMMON_HEADERS,
    params: {
      lot_id: '6354',
      buyer_order_id: '264'
    }
  });
  let poMappingSuccess = check(poMappingResponse, {
    'PO mapping details status is 200': (r) => r.status === 200,
    'PO mapping response is JSON': (r) => validateJsonResponse(r),
    'PO mapping has expected fields': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'lot_id' in body &&
               'buyer_order_id' in body &&
               typeof body.lot_id === 'number' &&
               typeof body.buyer_order_id === 'number';
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!poMappingSuccess);
  successRate.add(poMappingSuccess);
  sleep(1);

  // 6. Master Sample Detail
  let masterSampleResponse = http.get(`${BASE_URL}v3/master_sample/detail`, {
    headers: COMMON_HEADERS,
    params: { lot_id: '550' }
  });
  let masterSampleSuccess = check(masterSampleResponse, {
    'Master sample detail status is 200': (r) => r.status === 200,
    'Master sample response is JSON': (r) => validateJsonResponse(r),
    'Master sample has expected fields': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'lot_id' in body &&
               'sample_details' in body &&
               Array.isArray(body.sample_details) &&
               (body.sample_details.length === 0 || body.sample_details.every(detail => 
                 'id' in detail &&
                 'status' in detail &&
                 typeof detail.id === 'number' &&
                 typeof detail.status === 'string'
               ));
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!masterSampleSuccess);
  successRate.add(masterSampleSuccess);
  sleep(1);

  // 7. Fetch All RPM
  let rpmResponse = http.get(`${BASE_URL}v1/users/fetch_all_rpm`, {
    headers: COMMON_HEADERS,
  });
  let rpmSuccess = check(rpmResponse, {
    'RPM status is 200': (r) => r.status === 200,
    'RPM response is JSON': (r) => validateJsonResponse(r),
    'RPM has expected fields': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body) &&
               (body.length === 0 || body.every(rpm => 
                 'id' in rpm &&
                 'name' in rpm &&
                 'status' in rpm &&
                 typeof rpm.id === 'number' &&
                 typeof rpm.name === 'string' &&
                 typeof rpm.status === 'boolean'
               ));
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!rpmSuccess);
  successRate.add(rpmSuccess);
  sleep(1);

  // 8. Fetch Districts
  let districtsResponse = http.get(`${BASE_URL}v1/location/districts`, {
    headers: COMMON_HEADERS,
    params: { master_state_id: '2' }
  });
  let districtsSuccess = check(districtsResponse, {
    'Districts status is 200': (r) => r.status === 200,
    'Districts response is JSON': (r) => validateJsonResponse(r),
    'Districts has expected fields': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body) &&
               (body.length === 0 || body.every(district => 
                 'id' in district &&
                 'name' in district &&
                 'state_id' in district &&
                 typeof district.id === 'number' &&
                 typeof district.name === 'string' &&
                 typeof district.state_id === 'number' &&
                 district.state_id === 2 // Validate against parameter
               ));
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!districtsSuccess);
  successRate.add(districtsSuccess);
  sleep(1);

  // 9. Fetch Lot Details
  let lotDetailsResponse = http.get(`${BASE_URL}v3/master_sample/detail`, {
    headers: COMMON_HEADERS,
    params: { lot_id: '6690' }
  });
  let lotDetailsSuccess = check(lotDetailsResponse, {
    'Lot details status is 200': (r) => r.status === 200,
  });
  errorRate.add(!lotDetailsSuccess);
  successRate.add(lotDetailsSuccess);
  sleep(1);

  // 10. Fetch Purchase Order Details
  let purchaseOrderResponse = http.get(`${BASE_URL}v1/purchase_order/4227`, {
    headers: COMMON_HEADERS,
  });
  let purchaseOrderSuccess = check(purchaseOrderResponse, {
    'Purchase order details status is 200': (r) => r.status === 200,
    'Purchase order response is JSON': (r) => validateJsonResponse(r),
    'Purchase order has expected fields': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'id' in body &&
               'po_number' in body &&
               'status' in body;
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!purchaseOrderSuccess);
  successRate.add(purchaseOrderSuccess);
  sleep(1);

  // 11. Get SO for Mapping
  let soMappingResponse = http.get(`${BASE_URL}v1/buyer/order/4227`, {
    headers: COMMON_HEADERS,
  });
  let soMappingSuccess = check(soMappingResponse, {
    'SO mapping status is 200': (r) => r.status === 200,
  });
  errorRate.add(!soMappingSuccess);
  successRate.add(soMappingSuccess);
  sleep(1);

  // 12. Get Doc for Approval
  let docApprovalResponse = http.get(`${BASE_URL}v1/purchase_order/doc_approval/4227`, {
    headers: COMMON_HEADERS,
  });
  let docApprovalSuccess = check(docApprovalResponse, {
    'Doc approval status is 200': (r) => r.status === 200,
  });
  errorRate.add(!docApprovalSuccess);
  successRate.add(docApprovalSuccess);
  sleep(1);

  // 13. Fetch Requested Payment
  let requestedPaymentResponse = http.get(`${BASE_URL}v4/payment/requested_payment`, {
    headers: COMMON_HEADERS,
    params: {
      po_id: '4227',
      payment_for: '1'
    }
  });
  let requestedPaymentSuccess = check(requestedPaymentResponse, {
    'Requested payment status is 200': (r) => r.status === 200,
    'Requested payment response is JSON': (r) => validateJsonResponse(r),
    'Requested payment has expected fields': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'payment_details' in body &&
               'status' in body;
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!requestedPaymentSuccess);
  successRate.add(requestedPaymentSuccess);
  sleep(1);

  // 14. Fetch Deduction Reasons for Retailer
  let retailerDeductionResponse = http.get(`${BASE_URL}v1/payment/deduction_reasons/retailer`, {
    headers: COMMON_HEADERS,
  });
  let retailerDeductionSuccess = check(retailerDeductionResponse, {
    'Retailer deduction reasons status is 200': (r) => r.status === 200,
    'Retailer deduction response is JSON': (r) => validateJsonResponse(r),
    'Retailer deduction has expected fields': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body) &&
               (body.length === 0 || body.every(reason => 
                 'id' in reason &&
                 'reason' in reason &&
                 'status' in reason &&
                 typeof reason.id === 'number' &&
                 typeof reason.reason === 'string' &&
                 typeof reason.status === 'boolean'
               ));
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!retailerDeductionSuccess);
  successRate.add(retailerDeductionSuccess);
  sleep(1);

  // 15. Fetch Payment Rejection Reasons
  let rejectionReasonsResponse = http.get(`${BASE_URL}v4/payment/rejection_reasons`, {
    headers: COMMON_HEADERS,
    params: { rejection_for: '1' }
  });
  let rejectionReasonsSuccess = check(rejectionReasonsResponse, {
    'Payment rejection reasons status is 200': (r) => r.status === 200,
    'Payment rejection response is JSON': (r) => validateJsonResponse(r),
    'Payment rejection has valid structure': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body) &&
               (body.length === 0 || body.every(reason => 
                 'id' in reason &&
                 'reason' in reason &&
                 typeof reason.id === 'number' &&
                 typeof reason.reason === 'string' &&
                 reason.reason.length > 0
               ));
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!rejectionReasonsSuccess);
  successRate.add(rejectionReasonsSuccess);
  sleep(1);

  // 16. Fetch GST Payment Detail
  let gstPaymentResponse = http.get(`${BASE_URL}v4/payment/gst/details`, {
    headers: COMMON_HEADERS,
    params: { po_id: '4227' }
  });
  let gstPaymentSuccess = check(gstPaymentResponse, {
    'GST payment details status is 200': (r) => r.status === 200,
    'GST payment response is JSON': (r) => validateJsonResponse(r),
    'GST payment has expected fields': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'gst_amount' in body &&
               'payment_status' in body &&
               typeof body.gst_amount === 'number' &&
               body.gst_amount >= 0 &&
               typeof body.payment_status === 'string';
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!gstPaymentSuccess);
  successRate.add(gstPaymentSuccess);
  sleep(1);

  // 17. Fetch Transport Payment Detail
  let transportPaymentResponse = http.get(`${BASE_URL}v4/payment/transport/details`, {
    headers: COMMON_HEADERS,
    params: { po_id: '4227' }
  });
  let transportPaymentSuccess = check(transportPaymentResponse, {
    'Transport payment details status is 200': (r) => r.status === 200,
    'Transport payment response is JSON': (r) => validateJsonResponse(r),
    'Transport payment has valid structure': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'transport_amount' in body &&
               'payment_status' in body &&
               typeof body.transport_amount === 'number' &&
               body.transport_amount >= 0 &&
               ['pending', 'completed', 'failed'].includes(body.payment_status);
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!transportPaymentSuccess);
  successRate.add(transportPaymentSuccess);
  sleep(1);

  // 18. Fetch Retailer Payment Detail
  let retailerPaymentResponse = http.get(`${BASE_URL}v4/payment/retailer/details`, {
    headers: COMMON_HEADERS,
    params: { po_id: '4227' }
  });
  let retailerPaymentSuccess = check(retailerPaymentResponse, {
    'Retailer payment details status is 200': (r) => r.status === 200,
    'Retailer payment response is JSON': (r) => validateJsonResponse(r),
    'Retailer payment has expected structure': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'retailer_amount' in body &&
               'payment_status' in body &&
               'deductions' in body &&
               typeof body.retailer_amount === 'number' &&
               body.retailer_amount >= 0;
      } catch (e) {
        return false;
      }
    },
    'Retailer payment deductions are valid': (r) => {
      try {
        const body = r.json();
        return !body || !body.deductions || !Array.isArray(body.deductions) || 
          body.deductions.every(deduction =>
            'amount' in deduction &&
            'reason' in deduction &&
            typeof deduction.amount === 'number' &&
            deduction.amount >= 0 &&
            typeof deduction.reason === 'string'
          );
      } catch (e) {
        return false;
      }
    }
  });
  errorRate.add(!retailerPaymentSuccess);
  successRate.add(retailerPaymentSuccess);
  sleep(1);

  // 19. Listing API (Fixed validation)
  let listingResponse = http.get(`${BASE_URL}v5/master_sample/list`, {
    headers: COMMON_HEADERS,
    params: {
      page: '1',
      limit: '50',
      business_type: '3',
      tab_type_id: '8',
      po_created_from_date: '2024-08-24',
      po_created_to_date: '2024-08-24'
    }
  });
  let listingSuccess = check(listingResponse, {
    'Listing status is 200': (r) => r.status === 200,
    'Listing response is JSON': (r) => validateJsonResponse(r),
    'Listing has expected structure': (r) => {
      try {
        const body = r.json();
        return body && typeof body === 'object' &&
               'data' in body &&
               'total_count' in body &&
               Array.isArray(body.data) &&
               typeof body.total_count === 'number' &&
               body.total_count >= 0;
      } catch (e) {
        return false;
      }
    },
    'Listing data items are valid': (r) => {
      try {
        const body = r.json();
        return body && body.data && Array.isArray(body.data) && 
               (body.data.length === 0 || body.data.every(item =>
                 'id' in item &&
                 'status' in item &&
                 'created_at' in item &&
                 typeof item.id === 'number' &&
                 typeof item.status === 'string' &&
                 !isNaN(Date.parse(item.created_at))
               ));
      } catch (e) {
        return false;
      }
    },
    'Listing pagination is valid': (r) => {
      try {
        const body = r.json();
        return !body || !body.data || !Array.isArray(body.data) || body.data.length <= 50; // Verify limit parameter
      } catch (e) {
        return true; // If we can't parse the response, consider pagination valid
      }
    }
  });
  errorRate.add(!listingSuccess);
  successRate.add(listingSuccess);
  sleep(1);
}