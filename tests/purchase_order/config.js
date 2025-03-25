import http from 'k6/http';

export const config = {
  BASE_URL: "https://dev-ml.farmartos.com/",
  
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "origin": "https://fmt-dev-ml.web.app",
    "referer": "https://fmt-dev-ml.web.app/",
    "sec-ch-ua": '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
  },
  
  ENDPOINTS: {
    FETCH_STATES: "/v1/location/states",
    FETCH_ALL_PA: "/v1/campaign/fetch_all_pa",
    TAB_FREQUENCY: "/v1/master_sample/tab_frequency",
    PO_APPROVE_DETAILS: "/v1/master_sample/po_to_approve_details",
    PO_MAPPING_DETAILS: "/v1/master_sample/po_mapping_transaction_details",
    MASTER_SAMPLE_DETAIL: "/v3/master_sample/detail"
  },
  
  QUERY_PARAMS: {
    TAB_FREQUENCY: {
      business_type: "3",
      pa_ids: "109,176",
      rpm_ids: "253",
      state_ids: "5",
      po_created_from_date: "2024-10-23",
      po_created_to_date: "2024-10-24"
    },
    PO_APPROVE_DETAILS: {
      lot_id: "6715"
    },
    PO_MAPPING_DETAILS: {
      lot_id: "6354",
      buyer_order_id: "264"
    },
    MASTER_SAMPLE_DETAIL: {
      lot_id: "550"
    }
  },
  
  // Alternate tokens for randomization
  AUTH_TOKENS: [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTdjMDAwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiYzhiMzdlMWEwNmE3ZmMxNjk2MWM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YjI4IiwiaWF0IjoxNzI3MTgyODc5fQ._uBipw5E3fkcQ0_Mm_sNznC1UQzwzAozmlxIBqEMkyU",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzI1ODYzNzg2fQ.DdMZAXxYGAzAEm491l0PoSrEdkgg32TnxmI54tJbcdI"
  ],
  
  // Randomizable lot IDs for testing variety
  LOT_IDS: ["550", "6354", "6715", "6800", "6900"]
};
export default function () {
  console.log("Config file loaded successfully.");
  
  // Optional: Make a test API call to verify config
  let res = http.get(`${config.BASE_URL}${config.ENDPOINTS.FETCH_STATES}`, {
    headers: config.HEADERS
  });

  console.log(`Response status: ${res.status}`);
}
