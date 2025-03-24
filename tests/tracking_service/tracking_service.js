import http from "k6/http";
import { check, sleep } from "k6";
import { 
  trackingSpikeTest as spikeTest, 
  trackingLoadTest as loadTest, 
  trackingStressTest as stressTest,
  errorRate,
  successRate,
  createTripTrend,
  tripDetailTrend,
  apiRequestsCounter
} from "./Scenarios.js";
import { config } from "./Config.js";
// Get scenario from CLI argument (default: loadTest)

const scenarioName = __ENV.SCENARIO || "loadTest"; 

const scenarios = {
  spikeTest,
  loadTest,
  stressTest,
};

// Validate scenario and apply it
export const options = scenarios[scenarioName] || loadTest;

export default function () {
  let responses = [];

  // 1. Create and Start Trip
  let tripPayload = JSON.stringify({
    source_address: {
      lat: "26.0905486",
      long: "85.4616572",
      default_name: "Manika math",
      detailed_address: "Manika math bihar",
      district: "MANIKA",
      pincode: 843148,
      state: "Bihar",
    },
    destination_address: {
      lat: "26.289080",
      long: "84.4592701",
      default_name: "Mira chapra madhaupur",
      detailed_address: "As feeds, Mira chapra madhaupur, Siwan Bihar",
      district: "Siwan",
      pincode: 841232,
      state: "Bihar",
    },
    name: "Namd kumar singh",
    additional_info: { vehicle_number: "Up56AT2072" },
    mobile_number_for_tracking: "8294913792",
  });

  responses.push(http.post(`${config.BASE_URL}${config.ENDPOINTS.CREATE_TRIP}`, tripPayload, { headers: config.HEADERS }));

  // 2. Fetch External Trip Details
  responses.push(http.get(`${config.BASE_URL}${config.ENDPOINTS.TRIP_DETAIL}?encrypted_trip_id=${config.TRIP_IDS.ENCRYPTED_TRIP_ID}`, { headers: config.HEADERS }));

  // 3. Change Mobile Number for Tracking
  let changeNumberPayload = JSON.stringify({
    encrypted_trip_id: config.TRIP_IDS.ENCRYPTED_TRIP_ID,
    trip_number: config.TRIP_IDS.TRIP_NUMBER,
    mobile_number_for_tracking: "7906411090",
  });

  responses.push(http.patch(`${config.BASE_URL}${config.ENDPOINTS.EDIT_MOBILE}`, changeNumberPayload, { headers: config.HEADERS }));

  // 4. Get Platform API Key
  let apiKeyPayload = JSON.stringify({
    encrypted_token: config.USER_CREDENTIALS.ENCRYPTED_TOKEN,
    email_id: config.USER_CREDENTIALS.EMAIL,
  });

  responses.push(http.post(`${config.BASE_URL}${config.ENDPOINTS.GET_API_KEY}`, apiKeyPayload, { headers: config.HEADERS }));

  // 5. Fetch Location List
  responses.push(http.get(`${config.BASE_URL}${config.ENDPOINTS.TRIP_DETAIL}?encrypted_trip_id=${config.TRIP_IDS.ENCRYPTED_TRIP_ID}`, { headers: config.HEADERS }));

  // 6. Edit Location
  let editLocationPayload = JSON.stringify({
    trip_number: "TRPSB24000554",
    source_address: {
      lat: "28.5118907",
      long: "77.0861871",
      default_name: "Aihp 2",
      detailed_address: "Aihp 2",
      district: "Gurugram",
    },
    destination_address: {
      lat: "28.5118514",
      long: "77.0697161",
      default_name: "Hanuman Chawk 2",
      detailed_address: "Hanuman Chawk 2",
      district: "Gurugram",
    },
  });

  responses.push(http.patch(`${config.BASE_URL}${config.ENDPOINTS.EDIT_TRIP_ADDRESS}`, editLocationPayload, { headers: config.HEADERS }));

  // 7. Fetch Trip Details
  responses.push(http.get(`${config.BASE_URL}${config.ENDPOINTS.TRIP_DETAIL}?encrypted_trip_id=${config.TRIP_IDS.ENCRYPTED_TRIP_ID}`, { headers: config.HEADERS }));

  // 8. Get Location Details External
  responses.push(http.get(`${config.BASE_URL}${config.ENDPOINTS.LOCATION_DETAIL}?encrypted_trip_id=9b1f702f94fd88f1736b8fc2&page_no=1`, { headers: config.HEADERS }));

  // 9. Refresh Consent Status
  let refreshConsentPayload = JSON.stringify({
    mobile_number: "",
    trip_number: config.TRIP_IDS.TRIP_NUMBER,
  });

  responses.push(http.post(`${config.BASE_URL}${config.ENDPOINTS.REFRESH_CONSENT}`, refreshConsentPayload, { headers: config.HEADERS }));

  // Validate responses
  for (let i = 0; i < responses.length; i++) {
    check(responses[i], {
      [`Request ${i + 1}: Status is ${responses[i].status}`]: (r) => r.status === 200,
    });
  }

  sleep(1); // Add delay between requests
}
