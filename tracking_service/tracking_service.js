import http from "k6/http";
import { check, sleep } from "k6";
import { IFrameElement } from "k6/html";

// Load test settings
export let options = {
    stages: [
      { duration: '30s', target: 10 }, // Ramp up to 10 users
      { duration: '1m', target: 10 },  // Stay at 10 users for 1 minute
      { duration: '30s', target: 0 },  // Ramp down to 0 users
    ],
    thresholds: {
      http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
      http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
    },
  };

// Base URL (DEV only)
const BASE_URL = "https://dev-tracking.saudabooks.com";

// Common headers
const headers = {
  "Content-Type": "application/json",
 "apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjY3NTkwYmNkZmE5NjAzN2IyOTk5MDI4YzZmNzIyIiwiaWF0IjoxNzQyMzA5MjY3fQ.CqnpVG4-_GXVCdsWYOQ5P5unKtJcYt4JQA0AR1JmpC0",
};

// API Endpoints
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
    additional_info: {
      vehicle_number: "Up56AT2072",
    },
    mobile_number_for_tracking: "8294913792",
  });

  responses.push(http.post(`${BASE_URL}/v1/trip/createAndStart`, tripPayload, { headers }));

  // 2. Fetch External Trip Details
  responses.push(
    http.get(`${BASE_URL}/v2/trip/tripDetailExternal?encrypted_trip_id=90427528c2ab8bf0773cdf`, {
      headers,
    })
  );

  // 3. Change Mobile Number for Tracking
  let changeNumberPayload = JSON.stringify({
    encrypted_trip_id:
      "d305727082b8d8b27132b283816791a32d26ec27511140c05b2e1a53f2c40167b1d8dc57b5f488e4d461f2ab790fb21b0bb0f328994793ada65367cf0beec3",
    trip_number: "TRPFM25001561",
    mobile_number_for_tracking: "7906411090",
  });

  responses.push(http.patch(`${BASE_URL}/v1/trip/editMobileNumber`, changeNumberPayload, { headers }));

  // 4. Get Platform API Key
  let apiKeyPayload = JSON.stringify({
    encrypted_token:
      "CYVRHQfYYrcScZJZDEIrdj4hGJnM5i0Zb2qiFOGhUbsNAFrwwLVidtIvTOy8R9yId/senQ40dnm4Zf9qL9g1gMn9cqCCWgRbTLSExIY5vxv7+vFO7qLbTIa9NlSemWvp2Elaz6RmScU6tjIeveTxDZvwICol4yFI16i/bnElJ/N8mVBZ2cp31BIWzzs9/NJwJ1/DfQSicOpQgedZUxV+6zg4OEeJ/0s/NoBNLGvJ9AgxjDEFFBYIJsG5rSq2MSGJ7wfdeQx2NWtx7sWht//jCAuVr0NjRZ5i3yGvrgB+2S9HILI7tI+9Kvapng/wlz6oVb+Bvo5OD/KYB51Kz09tHQ==",
    email_id: "neeraj1@farmart.co",
  });

  responses.push(http.post(`${BASE_URL}/v1/auth/getApiKey`, apiKeyPayload, { headers }));

  // 5. Fetch Location List
  responses.push(
    http.get(`${BASE_URL}/v1/trip/tripDetailExternal?encrypted_trip_id=90427528c2ab8bf0773cdf`, {
      headers,
    })
  );

  // 6. Edit Location
  let editLocationPayload = JSON.stringify({
    trip_number: "TRPSB24000554",
    source_address: {
      lat: "28.5118907",
      long: "77.0861871",
      default_name: "Aihp 2",
      detailed_address: "Aihp 2",
      district: "Gurugram",
      pincode: null,
      state: "",
    },
    destination_address: {
      lat: "28.5118514",
      long: "77.0697161",
      default_name: "Hanuman Chawk 2",
      detailed_address: "Hanuman Chawk 2",
      district: "Gurugram",
      pincode: null,
      state: "",
    },
  });

  responses.push(http.patch(`${BASE_URL}/v1/trip/editTripAddress`, editLocationPayload, { headers }));

  // 7. Fetch Trip Details
  responses.push(
    http.get(`${BASE_URL}/v2/trip/tripDetailExternal?encrypted_trip_id=90427528c2ab8bf0773cdf`, {
      headers,
    })
  );

  // 8. Get Location Details External
  responses.push(
    http.get(`${BASE_URL}/v2/trip/locationDetailExternal?encrypted_trip_id=9b1f702f94fd88f1736b8fc2&page_no=1`, {
      headers
    })
  );

  // 9. Refresh Consent Status
  let refreshConsentPayload = JSON.stringify({
    mobile_number: "",
    trip_number: "TRPFM25001561",
  });

  responses.push(http.post(`${BASE_URL}/v1/trip/refreshConsent`, refreshConsentPayload, { headers }));

  // Validate responses
  for (let i = 0; i < responses.length; i++) {
    check(responses[i], {
      [`Request ${i + 1}: Status is  and reponse is ${JSON.parse(responses[i].status)}`]: (r) => r.status === 200,
    });
    /* if i == 0 then get the trip nmber from response {
    if (i == 0) {
       }
    */

  }

  sleep(1); // Add some delay between requests
}
