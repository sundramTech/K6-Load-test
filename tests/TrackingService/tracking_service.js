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

// Add validation utilities
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
      this.messages = [];
    }
  }
};

// Schema definitions for each endpoint
const schemas = {
  createTrip: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: [
        'id', 'tracking_consent_id', 'status', 'source_id', 'destination_id',
        'trip_number', 'distance', 'is_active', 'trip_tracking_status',
        'consent_status', 'allow_tracking', 'trip_link', 'trip_id', 'encrypted_trip_id'
      ],
      types: {
        id: 'number',
        tracking_consent_id: 'number',
        status: 'number',
        distance: 'number',
        is_active: 'boolean',
        trip_number: 'string',
        trip_link: 'string',
        encrypted_trip_id: 'string'
      }
    }
  },

  tripDetail: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: ['trip_status', 'consent_status', 'trip_detail'],
      types: {
        trip_status: 'number',
        consent_status: 'number'
      },
      trip_detail: {
        required: [
          'trip_number', 'ETA', 'distance', 'encrypted_trip_id',
          'source_address', 'desination_address', 'vehicle_details'
        ],
        address: {
          required: ['latitude', 'longitude', 'address_name', 'detailed_address', 'district'],
          types: {
            latitude: 'string',
            longitude: 'string',
            address_name: 'string',
            detailed_address: 'string',
            district: 'string'
          }
        },
        vehicle_details: {
          required: ['vehicle_number', 'driver_name'],
          types: {
            vehicle_number: 'string',
            driver_name: 'string'
          }
        }
      }
    }
  },

  apiKey: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: ['apikey'],
      types: {
        apikey: 'string'
      }
    }
  },

  refreshConsent: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: ['consent_status', 'trip_status', 'is_error'],
      types: {
        consent_status: 'string',
        trip_status: 'number',
        is_error: 'boolean',
        sim_type: 'number'
      }
    }
  },

  changeMobile: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: [
        'id', 'tracking_consent_id', 'status', 'source_id', 'destination_id',
        'trip_number', 'distance', 'is_active', 'trip_tracking_status',
        'consent_status', 'allow_tracking', 'mobile_number_for_tracking'
      ],
      types: {
        id: 'number',
        tracking_consent_id: 'number',
        status: 'number',
        source_id: 'number',
        destination_id: 'number',
        trip_number: 'string',
        distance: 'number',
        is_active: 'boolean',
        trip_tracking_status: 'number',
        consent_status: 'number',
        allow_tracking: 'boolean',
        mobile_number_for_tracking: 'number'
      }
    }
  },

  editLocation: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: [
        'trip_id', 'trip_number', 'distance', 'eta',
        'encrypted_trip_id', 'trip_link'
      ],
      types: {
        trip_id: 'number',
        trip_number: 'string',
        distance: 'number',
        eta: 'string',
        encrypted_trip_id: 'string',
        trip_link: 'string'
      }
    }
  },

  locationDetail: {
    required: ['status', 'message', 'data'],
    status: 'boolean',
    message: 'string',
    data: {
      required: [
        'trip_status', 'consent_status', 'trip_tracking_status',
        'trip_detail'
      ],
      types: {
        trip_status: 'number',
        consent_status: 'number',
        consent_removed: 'boolean',
        trip_tracking_status: 'number'
      },
      trip_detail: {
        required: [
          'trip_number', 'source_address', 'desination_address',
          'current_address', 'vehicle_details', 'distance',
          'encrypted_trip_id'
        ],
        types: {
          trip_number: 'string',
          distance: 'number',
          encrypted_trip_id: 'string',
          driver_name: 'string',
          driver_mobile_number: 'number',
          ETA: 'string',
          dispatched_at: 'string'
        },
        address: {
          required: ['latitude', 'longitude', 'detailed_address'],
          types: {
            latitude: 'string',
            longitude: 'string',
            address_name: 'string',
            detailed_address: 'string',
            district: 'string',
            state: 'string'
          }
        },
        vehicle_details: {
          required: ['vehicle_number', 'driver_name'],
          types: {
            vehicle_number: 'string',
            driver_name: 'string',
            driver_number: 'number'
          }
        }
      }
    }
  }
};

// Generic validation function
function validateJsonResponse(response, schemaType) {
  try {
    const parsedResponse = response.json();
    
    if (!schemaType || !schemas[schemaType]) {
      return typeof parsedResponse === 'object' && parsedResponse !== null;
    }

    const schema = schemas[schemaType];

    // Validate required top-level fields
    schema.required.forEach(field => {
      if (!(field in parsedResponse)) {
        validationWarnings.addWarning(schemaType, `Missing required field: ${field}`);
      }
    });

    // Validate status and message types
    if (typeof parsedResponse.status !== 'boolean') {
      validationWarnings.addWarning(schemaType, `Invalid status type. Expected boolean, got ${typeof parsedResponse.status}`);
    }
    if (typeof parsedResponse.message !== 'string') {
      validationWarnings.addWarning(schemaType, `Invalid message type. Expected string, got ${typeof parsedResponse.message}`);
    }

    // Validate data structure
    if (schema.data && parsedResponse.data) {
      validateDataStructure(parsedResponse.data, schema.data, schemaType);
    }

    validationWarnings.printWarnings();
    return true;

  } catch (e) {
    validationWarnings.addWarning(schemaType, `Validation error: ${e.message}`);
    validationWarnings.printWarnings();
    return true;
  }
}

// Helper function to validate nested data structures
function validateDataStructure(data, schema, schemaType, path = '') {
  // Check required fields
  if (schema.required) {
    schema.required.forEach(field => {
      if (!(field in data)) {
        validationWarnings.addWarning(schemaType, `${path}Missing required field: ${field}`);
      }
    });
  }

  // Check field types
  if (schema.types) {
    Object.entries(schema.types).forEach(([field, expectedType]) => {
      if (field in data && typeof data[field] !== expectedType) {
        validationWarnings.addWarning(schemaType, 
          `${path}Invalid type for ${field}. Expected ${expectedType}, got ${typeof data[field]}`);
      }
    });
  }

  // Validate nested structures
  if (schema.trip_detail && data.trip_detail) {
    validateDataStructure(data.trip_detail, schema.trip_detail, schemaType, 'trip_detail.');
  }

  // Validate address fields
  if (schema.address) {
    ['source_address', 'desination_address', 'current_address'].forEach(addressField => {
      if (data[addressField]) {
        validateDataStructure(data[addressField], schema.address, schemaType, `${addressField}.`);
      }
    });
  }
}

// Update the constants with both IDs
const CURRENT_TRIP_ID = "9d1f232ac2f0d8f3223c8bc0";
const CURRENT_TRIP_NUMBER = "TRPFM25001472";

export default function () {
  let responses = [];
  
  try {
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
      mobile_number_for_tracking: "7906411090",
    });

    let createTripResponse = http.post(`${config.BASE_URL}${config.ENDPOINTS.CREATE_TRIP}`, tripPayload, { headers: config.HEADERS });
    check(createTripResponse, {
      'Create Trip - Status 200': (r) => r.status === 200,
      'Create Trip - Schema Valid': (r) => validateJsonResponse(r, 'createTrip')
    });
    responses.push(createTripResponse);

    // 2. Fetch External Trip Details
    let tripDetailResponse = http.get(`${config.BASE_URL}${config.ENDPOINTS.TRIP_DETAIL}?encrypted_trip_id=${CURRENT_TRIP_ID}`, { headers: config.HEADERS });
    check(tripDetailResponse, {
      'Trip Detail - Status 200': (r) => r.status === 200,
      'Trip Detail - Schema Valid': (r) => validateJsonResponse(r, 'tripDetail')
    });
    responses.push(tripDetailResponse);

    // 3. Change Mobile Number for Tracking
    let changeNumberPayload = JSON.stringify({
      trip_number: CURRENT_TRIP_NUMBER,  // Use the specific trip number
      mobile_number_for_tracking: "7906411091"
    });

    let changeMobileResponse = http.patch(`${config.BASE_URL}${config.ENDPOINTS.EDIT_MOBILE}`, changeNumberPayload, { headers: config.HEADERS });
    check(changeMobileResponse, {
      'Change Mobile - Status 200': (r) => r.status === 200,
      'Change Mobile - Schema Valid': (r) => validateJsonResponse(r, 'changeMobile')
    });
    responses.push(changeMobileResponse);

    // 4. Get Platform API Key
    let apiKeyPayload = JSON.stringify({
      encrypted_token: config.USER_CREDENTIALS.ENCRYPTED_TOKEN,
      email_id: config.USER_CREDENTIALS.EMAIL,
    });

    let apiKeyResponse = http.post(`${config.BASE_URL}${config.ENDPOINTS.GET_API_KEY}`, apiKeyPayload, { headers: config.HEADERS });
    check(apiKeyResponse, {
      'API Key - Status 200': (r) => r.status === 200,
      'API Key - Schema Valid': (r) => validateJsonResponse(r, 'apiKey')
    });
    responses.push(apiKeyResponse);

    // 5. Fetch Location List
    responses.push(http.get(`${config.BASE_URL}${config.ENDPOINTS.TRIP_DETAIL}?encrypted_trip_id=${CURRENT_TRIP_ID}`, { headers: config.HEADERS }));

    // 6. Edit Location
    let editLocationPayload = JSON.stringify({
      trip_number: CURRENT_TRIP_NUMBER,  // Use the specific trip number
      source_address: {
        lat: "28.5118907",
        long: "77.0861871",
        default_name: "Aihp 2",
        detailed_address: "Aihp 2",
        district: "Gurugram"
      },
      destination_address: {
        lat: "28.5118514",
        long: "77.0697161",
        default_name: "Hanuman Chawk 2",
        detailed_address: "Hanuman Chawk 2",
        district: "Gurugram"
      }
    });

    let editLocationResponse = http.patch(`${config.BASE_URL}${config.ENDPOINTS.EDIT_TRIP_ADDRESS}`, editLocationPayload, { headers: config.HEADERS });
    check(editLocationResponse, {
      'Edit Location - Status 200': (r) => r.status === 200,
      'Edit Location - Schema Valid': (r) => validateJsonResponse(r, 'editLocation')
    });
    responses.push(editLocationResponse);

    // 7. Fetch Trip Details
    responses.push(http.get(`${config.BASE_URL}${config.ENDPOINTS.TRIP_DETAIL}?encrypted_trip_id=${CURRENT_TRIP_ID}`, { headers: config.HEADERS }));

    // 8. Get Location Details External
    responses.push(http.get(`${config.BASE_URL}${config.ENDPOINTS.LOCATION_DETAIL}?encrypted_trip_id=${CURRENT_TRIP_ID}&page_no=1`, { headers: config.HEADERS }));

    // 9. Refresh Consent Status
    let refreshConsentPayload = JSON.stringify({
      mobile_number: "",
      trip_number: CURRENT_TRIP_NUMBER  // Use the specific trip number
    });

    let refreshConsentResponse = http.post(`${config.BASE_URL}${config.ENDPOINTS.REFRESH_CONSENT}`, refreshConsentPayload, { headers: config.HEADERS });
    check(refreshConsentResponse, {
      'Refresh Consent - Status 200': (r) => r.status === 200,
      'Refresh Consent - Schema Valid': (r) => validateJsonResponse(r, 'refreshConsent')
    });
    responses.push(refreshConsentResponse);

    // Validate responses
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      
      // Track metrics
      errorRate.add(response.status !== 200);
      successRate.add(response.status === 200);
      apiRequestsCounter.add(1);

      if (response.status !== 200) {
        console.error(`Request ${i + 1} failed:`, {
          status: response.status,
          url: response.url,
          body: response.body,
        });
      }
    }
  } catch (error) {
    console.error('Test execution error:', error);
    errorRate.add(1);
    successRate.add(0);
  }

  sleep(1); // Add delay between requests
}
