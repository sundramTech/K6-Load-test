import { sleep, check } from 'k6';
import http from 'k6/http';
import { 
  poSpikeTest,
  errorRate,
  successRate,
  apiRequestsCounter,

} from './scenario.js';

// Test configuration - using scenarios from Scenario.js
export const options = poSpikeTest; // You can change this to poStressTest or poLoadTest based on your needs

// Base URL and common headers
const BASE_URL = 'https://ml-stage.farmartos.com/';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTdmMDQwYTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzQyNjQ1NTY0fQ.6PQLT4E6xJ-YCSNLGBVpIP8ofT6jSvrhEOuZoUH0rGg';

const COMMON_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7',
  'authorization': AUTH_TOKEN,
  'origin': 'https://fmt-stage-ml.web.app',
  'referer': 'https://fmt-stage-ml.web.app/',
  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"'
};

// Add a warning collector
const validationWarnings = {
  messages: [],
  addWarning(endpoint, message) {
    this.messages.push(`[${endpoint}] ${message}`);
  },
  printWarnings() {
    if (this.messages.length > 0) {
      console.log('\n=== Schema Validation Warnings ===');
      this.messages.forEach(msg => console.log(msg));
      console.log('===============================\n');
      this.messages = []; // Clear messages after printing
    }
  }
};

// Schema definitions
const schemas = {
  roleAccess: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: ['ROLE_ACCESS'],
      ROLE_ACCESS: {
        type: 'array',
        properties: {
          required: ['Product', 'Sections', 'Pages', 'Feature'],
          types: {
            Product: 'string',
            Sections: 'string',
            Pages: 'string',
            Feature: 'string'
          }
        },
        allowedFields: [
          '8', '11', '12', '13', '14', '15', '16', '18', '19', '20',
          '21', '23', '24', '27', '28', '36', '37', '38', '81', '85',
          'NEW', 'NEW_1', 'NEW_2', 'NEW_3', 'NEW_4', 'NEW_5', 'NEW_6', 'NEW_7'
        ]
      }
    }
  },

  // Generic error response schema
  errorResponse: {
    required: ['message'],
    types: {
      message: 'string'
    }
  },

  // Master Sample Detail schema with error handling
  masterSampleDetail: {
    required: ['status', 'message'],
    types: {
      status: 'boolean',
      message: 'string'
    },
    // Only validate data if status is true
    conditionalData: {
      when: 'status',
      isTrue: {
        required: [
          'CREATE_PO', 'PENDING_FOR_SO_MAPPING', 'DISPATCH_PENDING',
          'PAYMENT_REQUEST', 'PAYMENT_INITIATED', 'PARTIAL_PAYMENT', 'GRN_DEDUCTION'
        ],
        types: {
          CREATE_PO: 'number',
          PENDING_FOR_SO_MAPPING: 'number',
          DISPATCH_PENDING: 'number',
          PAYMENT_REQUEST: 'number',
          PAYMENT_INITIATED: 'number',
          PARTIAL_PAYMENT: 'number',
          GRN_DEDUCTION: 'number'
        }
      }
    }
  },

  // 2. PO Approval Details Schema
  poApprovalDetails: {
    required: ['status', 'message', 'data'],
    types: {
      status: 'boolean',
      message: 'string',
      data: {
        required: ['sample_details', 'po_finalised_details', 'f_o_r', 'dispatch_by', 'unloading_charges_to_be_borne_by'],
        types: {
          sample_details: 'object',
          po_finalised_details: 'object',
          f_o_r: 'number',
          dispatch_by: 'number',
          unloading_charges_to_be_borne_by: 'number'
        }
      }
    }
  },

  // 3. Termination Reasons Schema
  terminationReasons: {
    required: ['status', 'message', 'data'],
    types: {
      status: 'boolean',
      message: 'string',
      data: {
        required: ['po_termination_reason_list'],
        types: {
          po_termination_reason_list: {
            type: 'array',
            properties: {
              required: ['id', 'name'],
              types: {
                id: 'number',
                name: 'string'
              }
            }
          }
        }
      }
    }
  },

  // 4. Purchase Order Details Schema
  purchaseOrderDetails: {
    required: ['_id', 'farmartId', 'status', 'quantityInTon', 'amountPerQuintal'],
    types: {
      _id: 'number',
      farmartId: 'string',
      status: 'number',
      quantityInTon: 'number',
      amountPerQuintal: 'number'
    }
  },

  // 5. Trip Status Schema
  tripStatus: {
    required: ['status', 'message', 'data'],
    types: {
      status: 'boolean',
      message: 'string',
      data: {
        required: ['trip_id', 'consent_status', 'trip_status', 'is_tracking_enabled', 'po_status', 'farmart_id'],
        types: {
          trip_id: 'string',
          consent_status: 'number',
          trip_status: 'number',
          is_tracking_enabled: 'boolean',
          po_status: 'number',
          farmart_id: 'string'
        }
      }
    }
  },

  // 6. Payment Details Schema
  paymentDetails: {
    required: ['status', 'message', 'data'],
    types: {
      status: 'boolean',
      message: 'string',
      data: {
        required: ['po_id', 'payment_for', 'is_data_present'],
        types: {
          po_id: 'string',
          payment_for: 'string',
          is_data_present: 'boolean'
        }
      }
    }
  },

  // 7. Deduction Reasons Schema (works for both retailer and transport)
  deductionReasons: {
    required: ['status', 'message', 'data'],
    types: {
      status: 'boolean',
      message: 'string',
      data: {
        type: 'array',
        properties: {
          required: ['id', 'name'],
          types: {
            id: 'number',
            name: 'string'
          }
        }
      }
    }
  }
};

// Debug function
function debugResponse(response, name) {
  console.log(`=== Debug ${name} Response ===`);
  try {
    console.log(JSON.stringify(response.json(), null, 2));
  } catch (e) {
    console.log('Failed to parse response:', e.message);
  }
}

// Updated validation function
function validateJsonResponse(response, schemaType) {
  try {
    if (!response || !response.body) {
      validationWarnings.addWarning(schemaType || 'undefined', 
        'Response or response body is null - possible request failure');
      return false;
    }

    const parsedResponse = response.json();
    
    // Handle error responses
    if (parsedResponse.message && (!parsedResponse.status || parsedResponse.status === false)) {
      return validateJsonResponse(response, 'errorResponse');
    }

    if (!schemaType || !schemas[schemaType]) {
      return typeof parsedResponse === 'object' && parsedResponse !== null;
    }

    const schema = schemas[schemaType];
    let isValid = true;

    // Validate required fields and their types
    for (const field of schema.required) {
      if (!(field in parsedResponse)) {
        validationWarnings.addWarning(schemaType, `Missing required field: ${field}`);
        isValid = false;
      } else if (schema.types && schema.types[field] && 
                typeof parsedResponse[field] !== schema.types[field]) {
        validationWarnings.addWarning(schemaType,
          `Invalid type for ${field}. Expected ${schema.types[field]}, got ${typeof parsedResponse[field]}`);
        isValid = false;
      }
    }

    // Handle conditional data validation
    if (schema.conditionalData && parsedResponse[schema.conditionalData.when] === true) {
      const dataSchema = schema.conditionalData.isTrue;
      const data = parsedResponse.data;

      if (!data) {
        validationWarnings.addWarning(schemaType, 'Missing data object for successful response');
        isValid = false;
      } else {
        for (const field of dataSchema.required) {
          if (!(field in data)) {
            validationWarnings.addWarning(schemaType, `Missing required field in data: ${field}`);
            isValid = false;
          } else if (dataSchema.types && dataSchema.types[field] && 
                    typeof data[field] !== dataSchema.types[field]) {
            validationWarnings.addWarning(schemaType,
              `Invalid type for data.${field}. Expected ${dataSchema.types[field]}, got ${typeof data[field]}`);
            isValid = false;
          }
        }
      }
    }

    validationWarnings.printWarnings();
    return isValid;

  } catch (e) {
    validationWarnings.addWarning(schemaType || 'undefined', 
      `Validation error: ${e.message}`);
    validationWarnings.printWarnings();
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
  const LOT_ID = '23726';
  const PO_ID = '16248';
  const SO_ID = '4877';

  // Add debug logging before each request
  console.log('=== Request Debug Info ===');
  console.log('Using lot_id:', LOT_ID);
  console.log('lot_id type:', typeof LOT_ID);
  console.log('Request URL:', `${BASE_URL}v3/master_sample/detail?lot_id=${LOT_ID}`);

  // 1. User Role Access Check
  let roleAccessResponse = http.post(`${BASE_URL}v1/role_config/user_role_access`, null, {
    headers: COMMON_HEADERS
  });
  trackMetrics(roleAccessResponse, 'role_access');
  check(roleAccessResponse, {
    'role access status is 200': (r) => r.status === 200,
    'role access schema validated': (r) => validateJsonResponse(r, 'roleAccess')
  });
  sleep(1);

  // 2. Ticketing Encrypt
  let ticketingResponse = http.get(`${BASE_URL}v1/ticketing/encrypt`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(ticketingResponse, 'ticketing');
  check(ticketingResponse, {
    'ticketing encrypt status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 3. Master Sample List with Different Tab Types
  const tabTypes = [0, 1, 2, 3, 4, 5, 6, 8];
  for (let tabType of tabTypes) {
    let listResponse = http.get(`${BASE_URL}v5/master_sample/list`, {
      headers: COMMON_HEADERS,
      params: {
        page: '1',
        limit: '50',
        business_type: '3',
        tab_type_id: tabType.toString(),
        search_param: '',
        po_created_from_date: 'Mon, 01 Apr 2024'
      }
    });
    trackMetrics(listResponse, `list_tab_${tabType}`);
    check(listResponse, {
      [`tab ${tabType} list status is 200`]: (r) => r.status === 200,
      [`tab ${tabType} response is valid`]: (r) => validateJsonResponse(r)
    });
    sleep(1);
  }

  // 4. Master Sample Detail
  let masterSampleResponse = http.get(`${BASE_URL}v3/master_sample/detail`, {
    headers: COMMON_HEADERS,
    params: { 
      lot_id: LOT_ID
    }
  });
  trackMetrics(masterSampleResponse, 'master_sample_detail');
  check(masterSampleResponse, {
    'master sample detail status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 5. PO Approval Details
  let poApprovalResponse = http.get(`${BASE_URL}v1/master_sample/po_to_approve_details`, {
    headers: COMMON_HEADERS,
    params: { 
      lot_id: LOT_ID
    }
  });
  trackMetrics(poApprovalResponse, 'po_approval');
  check(poApprovalResponse, {
    'PO approval status is 200': (r) => r.status === 200,
    'PO approval schema is valid': (r) => validateJsonResponse(r, 'poApprovalDetails')
  });
  sleep(1);

  // 6. Get Termination Reasons
  let terminationResponse = http.get(`${BASE_URL}v2/purchase_order/termination_reasons`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(terminationResponse, 'termination_reasons');
  check(terminationResponse, {
    'termination reasons status is 200': (r) => r.status === 200,
    'termination reasons schema is valid': (r) => validateJsonResponse(r, 'terminationReasons')
  });
  sleep(1);

  // 7. Update Sample Status
  let updateResponse = http.patch(`${BASE_URL}v1/master_sample/14641/${LOT_ID}`, 
    JSON.stringify({
      dataToUpdate: [{
        property: "status",
        data: 13
      }]
    }), 
    { headers: { ...COMMON_HEADERS, 'content-type': 'application/json' } }
  );
  trackMetrics(updateResponse, 'update_status');
  check(updateResponse, {
    'update status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 8. Get Purchase Order Details
  let purchaseOrderResponse = http.get(`${BASE_URL}v1/purchase_order/${PO_ID}`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(purchaseOrderResponse, 'purchase_order');
  check(purchaseOrderResponse, {
    'purchase order status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 9. Get PO Mapping Transaction Details
  let mappingDetailsResponse = http.get(`${BASE_URL}v1/master_sample/po_mapping_transaction_details`, {
    headers: COMMON_HEADERS,
    params: { 
      lot_id: LOT_ID
    }
  });
  trackMetrics(mappingDetailsResponse, 'mapping_details');
  check(mappingDetailsResponse, {
    'mapping details status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 10. Get Buyer Order Details
  let buyerOrderResponse = http.get(`${BASE_URL}v1/buyer/order/${PO_ID}`, {
    headers: COMMON_HEADERS,
    params: { is_reattach: 'false' }
  });
  trackMetrics(buyerOrderResponse, 'buyer_order');
  check(buyerOrderResponse, {
    'buyer order status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 11. Map Purchase Order
  let poMappingResponse = http.post(`${BASE_URL}v1/purchase_order/map`,
    JSON.stringify({
      soId: parseInt(SO_ID),
      poId: parseInt(PO_ID)
    }),
    { headers: { ...COMMON_HEADERS, 'content-type': 'application/json' } }
  );
  trackMetrics(poMappingResponse, 'po_mapping');
  check(poMappingResponse, {
    'PO mapping status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 12. Verify Final Mapping Details
  let finalMappingResponse = http.get(`${BASE_URL}v1/master_sample/po_mapping_transaction_details`, {
    headers: COMMON_HEADERS,
    params: {
      lot_id: LOT_ID,
      buyer_order_id: SO_ID
    }
  });
  trackMetrics(finalMappingResponse, 'final_mapping');
  check(finalMappingResponse, {
    'final mapping status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 13. Get Updated Purchase Order Details
  let updatedPOResponse = http.get(`${BASE_URL}v1/purchase_order/${PO_ID}`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(updatedPOResponse, 'updated_po');
  check(updatedPOResponse, {
    'updated PO status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 14. Get Updated Master Sample Detail
  let updatedMasterSampleResponse = http.get(`${BASE_URL}v3/master_sample/detail`, {
    headers: COMMON_HEADERS,
    params: { lot_id: LOT_ID }
  });
  trackMetrics(updatedMasterSampleResponse, 'updated_master_sample');
  check(updatedMasterSampleResponse, {
    'updated master sample status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 15. Get Document Approval Details
  let docApprovalResponse = http.get(`${BASE_URL}v1/purchase_order/doc_approval/${PO_ID}`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(docApprovalResponse, 'doc_approval');
  check(docApprovalResponse, {
    'doc approval status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 16. Check Trip Status
  let tripStatusResponse = http.get(`${BASE_URL}v1/trip_tracking/check_trip_status`, {
    headers: COMMON_HEADERS,
    params: { po_id: PO_ID }
  });
  trackMetrics(tripStatusResponse, 'trip_status');
  check(tripStatusResponse, {
    'trip status check is 200': (r) => r.status === 200
  });
  sleep(1);

  // 17. Get Requested Payment Details - Retailer
  let retailerPaymentResponse = http.get(`${BASE_URL}v4/payment/requested_payment`, {
    headers: COMMON_HEADERS,
    params: { 
      po_id: PO_ID,
      payment_for: '1'
    }
  });
  trackMetrics(retailerPaymentResponse, 'retailer_payment');
  check(retailerPaymentResponse, {
    'retailer payment status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 18. Get Retailer Deduction Reasons
  let retailerDeductionResponse = http.get(`${BASE_URL}v1/payment/deduction_reasons/retailer`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(retailerDeductionResponse, 'retailer_deduction');
  check(retailerDeductionResponse, {
    'retailer deduction reasons status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 19. Get Payment Rejection Reasons - Retailer
  let retailerRejectionResponse = http.get(`${BASE_URL}v4/payment/rejection_reasons`, {
    headers: COMMON_HEADERS,
    params: { rejection_for: '1' }
  });
  trackMetrics(retailerRejectionResponse, 'retailer_rejection');
  check(retailerRejectionResponse, {
    'retailer rejection reasons status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 20. Get Transport Payment Details
  let transportPaymentResponse = http.get(`${BASE_URL}v4/payment/requested_payment`, {
    headers: COMMON_HEADERS,
    params: { 
      po_id: PO_ID,
      payment_for: '2'
    }
  });
  trackMetrics(transportPaymentResponse, 'transport_payment');
  check(transportPaymentResponse, {
    'transport payment status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 21. Get Transport Deduction Reasons
  let transportDeductionResponse = http.get(`${BASE_URL}v1/payment/deduction_reasons/transport`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(transportDeductionResponse, 'transport_deduction');
  check(transportDeductionResponse, {
    'transport deduction reasons status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 22. Get Payment Rejection Reasons - Transport
  let transportRejectionResponse = http.get(`${BASE_URL}v4/payment/rejection_reasons`, {
    headers: COMMON_HEADERS,
    params: { rejection_for: '2' }
  });
  trackMetrics(transportRejectionResponse, 'transport_rejection');
  check(transportRejectionResponse, {
    'transport rejection reasons status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 23. Get Transport Details
  let transportDetailsResponse = http.get(`${BASE_URL}v4/payment/transport/details`, {
    headers: COMMON_HEADERS,
    params: { po_id: PO_ID }
  });
  trackMetrics(transportDetailsResponse, 'transport_details');
  check(transportDetailsResponse, {
    'transport details status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 24. Get Retailer Details
  let retailerDetailsResponse = http.get(`${BASE_URL}v4/payment/retailer/details`, {
    headers: COMMON_HEADERS,
    params: { po_id: PO_ID }
  });
  trackMetrics(retailerDetailsResponse, 'retailer_details');
  check(retailerDetailsResponse, {
    'retailer details status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 25. Get GST Details
  let gstDetailsResponse = http.get(`${BASE_URL}v4/payment/gst/details`, {
    headers: COMMON_HEADERS,
    params: { po_id: PO_ID }
  });
  trackMetrics(gstDetailsResponse, 'gst_details');
  check(gstDetailsResponse, {
    'gst details status is 200': (r) => r.status === 200
  });
  sleep(1);
}