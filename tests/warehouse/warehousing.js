import { sleep, check } from 'k6';
import http from 'k6/http';
import { 
  warehouseLoadTest, 
  warehouseStressTest, 
  warehouseSpikeTest,
  errorRate,
  successRate,
  apiRequestsCounter,
  warehouseListTrend,
  cropDetailsTrend,
  consignmentCreateTrend,
  poCoListTrend
} from './Scenarios.js';

// Test configuration
export const options = warehouseSpikeTest; // Can be changed to warehouseStressTest or warehouseLoadTest

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
  if (name === 'warehouse_list') {
    warehouseListTrend.add(response.timings.duration);
  }
}

export default function() {
  // 1. Get Warehouse List
  let warehouseResponse = http.get(`${BASE_URL}v1/warehouse`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(warehouseResponse, 'warehouse_list');
  check(warehouseResponse, {
    'warehouse list status is 200': (r) => r.status === 200,
    'warehouse list response is JSON': (r) => validateJsonResponse(r)
  });
  sleep(1);

  // 2. Get Warehouse List with Limit
  let warehouseListResponse = http.get(`${BASE_URL}v2/warehouse`, {
    headers: COMMON_HEADERS,
    params: {
      limit: '50'
    }
  });
  trackMetrics(warehouseListResponse, 'warehouse_list_limit');
  check(warehouseListResponse, {
    'warehouse list with limit status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 3. Get Warehouse Details by ID
  let warehouseDetailsResponse = http.get(`${BASE_URL}v2/warehouse`, {
    headers: COMMON_HEADERS,
    params: {
      limit: '50',
      warehouse_id: '1'
    }
  });
  trackMetrics(warehouseDetailsResponse, 'warehouse_details');
  check(warehouseDetailsResponse, {
    'warehouse details status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 4. Get Warehouse Crop Details
  let cropDetailsResponse = http.get(`${BASE_URL}v2/warehouse/crop_details/1`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(cropDetailsResponse, 'warehouse_crop_details');
  check(cropDetailsResponse, {
    'warehouse crop details status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 5. Get Selected PO/CO List
  let poCoListResponse = http.get(`${BASE_URL}v2/warehouse/selected_po_co_list`, {
    headers: COMMON_HEADERS,
    params: {
      warehouse_id: '1',
      dispatch_qty: '200',
      crop_id: '3',
      variety_id: '3'
    }
  });
  trackMetrics(poCoListResponse, 'selected_po_co_list');
  check(poCoListResponse, {
    'selected po/co list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 6. Get Past PO/Consignment Details
  let pastPoDetailsResponse = http.get(`${BASE_URL}v1/consignment/past_po_or_consignment_details`, {
    headers: COMMON_HEADERS,
    params: {
      purchase_crop_order_id: '15282'
    }
  });
  trackMetrics(pastPoDetailsResponse, 'past_po_details');
  check(pastPoDetailsResponse, {
    'past po details status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 7. Get Bank Details from IFSC
  let bankDetailsResponse = http.get(`${BASE_URL}v3/retailer/bank_from_ifsc/ICIC0000399`, {
    headers: COMMON_HEADERS
  });
  trackMetrics(bankDetailsResponse, 'bank_details');
  check(bankDetailsResponse, {
    'bank details status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 8. Get Sales Order List
  let soListResponse = http.get(`${BASE_URL}v3/sales_order/so_list`, {
    headers: COMMON_HEADERS,
    params: {
      crop_id: '3',
      quantity: '0.2'
    }
  });
  trackMetrics(soListResponse, 'so_list');
  check(soListResponse, {
    'sales order list status is 200': (r) => r.status === 200
  });
  sleep(1);

  // 9. Create Consignment
  let consignmentPayload = {
    warehouse_id: 1,
    quantity: 200,
    crop_id: 3,
    crop_variety_id: 3,
    consignment_value: 7004,
    weighted_average_price_per_qtl: 3502,
    po_co_details: [{
      id: 1154,
      selected_quantity: 200,
      selected_value: 7004
    }],
    so_id: 242,
    gross_weight: 200,
    bag_deduction: 20,
    net_weight: 180,
    num_bags: 20,
    mandi_tax_amt: 200,
    transporter_name: "Test",
    vehicle_number: "CG10H5678",
    driver_name: "Test",
    driver_mobile_number: "9893096118",
    account_number: "123456789012",
    ifsc_code: "ICIC0000399",
    bank_name: "ICICI BANK",
    account_holder_name: "Sundram",
    transport_cost: 500,
    document_urls: {
      loadedTruckWeightSlip: "https://dempt00dokg0g.cloudfront.net/image/local/1742811774183",
      primary9rImage: "https://dempt00dokg0g.cloudfront.net/image/local/1731135810788",
      first9rGatePass: "https://dempt00dokg0g.cloudfront.net/image/local/1731135814013",
      transportBillImage: "https://dempt00dokg0g.cloudfront.net/image/local/1742811753420",
      aadhar_card_url: "https://dempt00dokg0g.cloudfront.net/image/local/1731135742967",
      tds_letter_url: "https://dempt00dokg0g.cloudfront.net/image/local/1731135746067",
      rc_url: "https://dempt00dokg0g.cloudfront.net/image/local/1731135739850",
      transport_cheque_url: "https://dempt00dokg0g.cloudfront.net/image/local/1731135749533",
      driving_license_url: "https://dempt00dokg0g.cloudfront.net/image/local/1731135729960",
      number_plate_url: "https://dempt00dokg0g.cloudfront.net/image/local/1731135733461",
      delivery_challan_url: "https://dempt00dokg0g.cloudfront.net/image/local/1742811765217"
    }
  };

  let consignmentResponse = http.post(`${BASE_URL}v1/consignment`,
    JSON.stringify(consignmentPayload),
    { headers: COMMON_HEADERS }
  );
  trackMetrics(consignmentResponse, 'create_consignment');
  check(consignmentResponse, {
    'create consignment status is 200': (r) => r.status === 200
  });
  sleep(1);
}