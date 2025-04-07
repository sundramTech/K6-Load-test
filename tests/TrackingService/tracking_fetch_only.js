import http from "k6/http";
import { check, sleep, group, fail } from "k6";
import { SharedArray } from "k6/data";
import { spikeTest, loadTest, stressTest, errorRate, successRate, createTripTrend, tripDetailTrend, apiRequestsCounter } from "./Scenarios.js";
import { config } from "./config.js";

// Get scenario from CLI argument (default: loadTest)
const scenarioName = __ENV.SCENARIO || "loadTest";

const scenarios = {
  spikeTest,
  loadTest,
  stressTest,
};

// Validate scenario and apply it
export const options = scenarios[scenarioName] || loadTest;

// Randomized data for testing variation
const mobileNumbers = ["8294913792", "7906411090", "9876543210", "8765432109", "7654321098"];
const vehicleNumbers = ["UP56AT2072", "DL8CAF1234", "HR26DQ5678", "MH12AB9876", "KA01MN5432"];
const names = ["Namd Kumar Singh", "Raj Sharma", "Priya Patel", "Vikram Malhotra", "Ananya Desai"];

// Generate random data
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function () {
  // Initialize result tracking
  let success = true;
  let responses = [];

  group("Trip Creation and Management Flow", function() {
    try {
      // 1. Create and Start Trip
      group("Create Trip", function() {
        const tripPayload = JSON.stringify({
          source_address: {
            lat: (26 + Math.random() * 0.5).toFixed(7),
            long: (85 + Math.random() * 0.5).toFixed(7),
            default_name: "Manika math",
            detailed_address: "Manika math bihar",
            district: "MANIKA",
            pincode: 843148,
            state: "Bihar",
          },
          destination_address: {
            lat: (26 + Math.random() * 0.5).toFixed(7),
            long: (84 + Math.random() * 0.5).toFixed(7),
            default_name: "Mira chapra madhaupur",
            detailed_address: "As feeds, Mira chapra madhaupur, Siwan Bihar",
            district: "Siwan",
            pincode: 841232,
            state: "Bihar",
          },
          name: getRandomItem(names),
          additional_info: { vehicle_number: getRandomItem(vehicleNumbers) },
          mobile_number_for_tracking: getRandomItem(mobileNumbers),
        });

        const createTripResponse = http.post(
          `${config.BASE_URL}${config.ENDPOINTS.CREATE_TRIP}`, 
          tripPayload, 
          { headers: config.HEADERS, tags: { name: "CreateTrip" } }
        );
        
        apiRequestsCounter.add(1);
        createTripTrend.add(createTripResponse.timings.duration);
        
        // Check and record success/failure
        const createTripSuccess = check(createTripResponse, {
          "Create Trip Status is 200": (r) => r.status === 200,
          "Create Trip has valid response": (r) => r.json().hasOwnProperty("data")
        });
        
        successRate.add(createTripSuccess);
        errorRate.add(!createTripSuccess);
        
        if (!createTripSuccess) {
          console.log(`Create Trip failed with status ${createTripResponse.status}: ${createTripResponse.body}`);
          success = false;
        }
        
        // Extract trip IDs if needed for subsequent requests
        if (createTripResponse.status === 200) {
          try {
            const responseBody = createTripResponse.json();
            if (responseBody.data && responseBody.data.encrypted_trip_id) {
              // You could use this ID for subsequent requests if needed
              // const newTripId = responseBody.data.encrypted_trip_id; 
            }
          } catch (e) {
            console.log("Error parsing create trip response: " + e);
          }
        }
        
        responses.push(createTripResponse);
        sleep(Math.random() * 0.5);  // Add randomized sleep between 0-0.5s
      });

      // 2. Fetch External Trip Details
      group("Fetch Trip Details", function() {
        const tripDetailResponse = http.get(
          `${config.BASE_URL}${config.ENDPOINTS.TRIP_DETAIL}?encrypted_trip_id=${config.TRIP_IDS.ENCRYPTED_TRIP_ID}`, 
          { headers: config.HEADERS, tags: { name: "TripDetail" } }
        );
        
        apiRequestsCounter.add(1);
        tripDetailTrend.add(tripDetailResponse.timings.duration);
        
        const tripDetailSuccess = check(tripDetailResponse, {
          "Trip Detail Status is 200": (r) => r.status === 200,
          "Trip Detail has valid content": (r) => r.json().hasOwnProperty("data")
        });
        
        successRate.add(tripDetailSuccess);
        errorRate.add(!tripDetailSuccess);
        
        responses.push(tripDetailResponse);
        sleep(Math.random() * 0.5);
      });

      // 3. Change Mobile Number for Tracking
      group("Change Mobile Number", function() {
        const changeNumberPayload = JSON.stringify({
          encrypted_trip_id: config.TRIP_IDS.ENCRYPTED_TRIP_ID,
          trip_number: config.TRIP_IDS.TRIP_NUMBER,
          mobile_number_for_tracking: getRandomItem(mobileNumbers),
        });

        const editMobileResponse = http.patch(
          `${config.BASE_URL}${config.ENDPOINTS.EDIT_MOBILE}`, 
          changeNumberPayload, 
          { headers: config.HEADERS, tags: { name: "EditMobile" } }
        );
        
        apiRequestsCounter.add(1);
        
        const editMobileSuccess = check(editMobileResponse, {
          "Edit Mobile Status is 200": (r) => r.status === 200
        });
        
        successRate.add(editMobileSuccess);
        errorRate.add(!editMobileSuccess);
        
        responses.push(editMobileResponse);
        sleep(Math.random() * 0.3);
      });

      // 4. Get Platform API Key (only do this occasionally to reduce load)
      if (Math.random() < 0.3) {  // Only execute 30% of the time
        group("Get API Key", function() {
          const apiKeyPayload = JSON.stringify({
            encrypted_token: config.USER_CREDENTIALS.ENCRYPTED_TOKEN,
            email_id: config.USER_CREDENTIALS.EMAIL,
          });

          const apiKeyResponse = http.post(
            `${config.BASE_URL}${config.ENDPOINTS.GET_API_KEY}`, 
            apiKeyPayload, 
            { headers: config.HEADERS, tags: { name: "GetApiKey" } }
          );
          
          apiRequestsCounter.add(1);
          
          const apiKeySuccess = check(apiKeyResponse, {
            "Get API Key Status is 200": (r) => r.status === 200
          });
          
          successRate.add(apiKeySuccess);
          errorRate.add(!apiKeySuccess);
          
          responses.push(apiKeyResponse);
          sleep(Math.random() * 0.2);
        });
      }

      // 5. Edit Location
      group("Edit Trip Address", function() {
        // Randomize locations slightly
        const editLocationPayload = JSON.stringify({
          trip_number: config.TRIP_IDS.TRIP_NUMBER,
          source_address: {
            lat: (28.51 + Math.random() * 0.01).toFixed(7),
            long: (77.08 + Math.random() * 0.01).toFixed(7),
            default_name: "Aihp 2",
            detailed_address: "Aihp 2",
            district: "Gurugram",
          },
          destination_address: {
            lat: (28.51 + Math.random() * 0.01).toFixed(7),
            long: (77.06 + Math.random() * 0.01).toFixed(7),
            default_name: "Hanuman Chawk 2",
            detailed_address: "Hanuman Chawk 2",
            district: "Gurugram",
          },
        });

        const editAddressResponse = http.patch(
          `${config.BASE_URL}${config.ENDPOINTS.EDIT_TRIP_ADDRESS}`, 
          editLocationPayload, 
          { headers: config.HEADERS, tags: { name: "EditAddress" } }
        );
        
        apiRequestsCounter.add(1);
        
        const editAddressSuccess = check(editAddressResponse, {
          "Edit Address Status is 200": (r) => r.status === 200
        });
        
        successRate.add(editAddressSuccess);
        errorRate.add(!editAddressSuccess);
        
        responses.push(editAddressResponse);
        sleep(Math.random() * 0.3);
      });

      // 6. Get Location Details External
      group("Get Location Details", function() {
        const locationDetailResponse = http.get(
          `${config.BASE_URL}${config.ENDPOINTS.LOCATION_DETAIL}?encrypted_trip_id=${config.TRIP_IDS.ENCRYPTED_TRIP_ID}&page_no=1`, 
          { headers: config.HEADERS, tags: { name: "LocationDetail" } }
        );
        
        apiRequestsCounter.add(1);
        
        const locationDetailSuccess = check(locationDetailResponse, {
          "Location Detail Status is 200": (r) => r.status === 200
        });
        
        successRate.add(locationDetailSuccess);
        errorRate.add(!locationDetailSuccess);
        
        responses.push(locationDetailResponse);
        sleep(Math.random() * 0.3);
      });

      // 7. Refresh Consent Status
      group("Refresh Consent", function() {
        const refreshConsentPayload = JSON.stringify({
          mobile_number: getRandomItem(mobileNumbers),
          trip_number: config.TRIP_IDS.TRIP_NUMBER,
        });

        const refreshConsentResponse = http.post(
          `${config.BASE_URL}${config.ENDPOINTS.REFRESH_CONSENT}`, 
          refreshConsentPayload, 
          { headers: config.HEADERS, tags: { name: "RefreshConsent" } }
        );
        
        apiRequestsCounter.add(1);
        
        const refreshConsentSuccess = check(refreshConsentResponse, {
          "Refresh Consent Status is 200": (r) => r.status === 200
        });
        
        successRate.add(refreshConsentSuccess);
        errorRate.add(!refreshConsentSuccess);
        
        responses.push(refreshConsentResponse);
      });
    } catch (error) {
      console.error('Trip management flow error:', error);
      errorRate.add(1);
      successRate.add(0);
    }
  });

  // Add a final sleep time to simulate real user behavior
  sleep(Math.random() * 1 + 0.5);  // Sleep between 0.5 and 1.5 seconds
}