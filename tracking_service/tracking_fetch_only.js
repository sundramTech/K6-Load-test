import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";
import { IFrameElement } from "k6/html";


const errors = new Rate('errors');
const requestDuration = new Trend('request_duration');

// Load test settings
export let options = {
    stages: [
      { duration: '1m', target: 10 },   // Ramp up to 10 users over 1 minute
      { duration: '3m', target: 10 },   // Stay at 10 users for 3 minutes
      { duration: '2m', target: 20 },   // Ramp up to 20 users over 2 minutes
      { duration: '3m', target: 20 },   // Stay at 20 users for 3 minutes
      { duration: '1m', target: 0 },    // Ramp down to 0 users
    ],
    thresholds: {
      http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% under 500ms, 99% under 1s
      http_req_failed: ['rate<0.01'],                 // Less than 1% failures
      'errors': ['rate<0.05'],                        // Less than 5% errors
      'request_duration': ['p(95)<1000'],             // 95% of requests under 1s
      'http_reqs': ['rate>100'],                      // At least 100 requests per second
    },
    // Additional test configuration
    noConnectionReuse: true,            // Don't reuse connections between iterations
    userAgent: 'K6LoadTest/1.0',
    maxRedirects: 4,
    dns: {
      ttl: '1m',                        // DNS TTL of 1 minute
      select: 'first',                  // Use first DNS record
    },
  };

// Base URL (DEV only)
const BASE_URL = "https://dev-tracking.saudabooks.com";

// Common headers
const headers = {
  "Content-Type": "application/json",
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjY3NTkwYmNkZmE5NjAzN2IyOTk5MDI4YzZmNzIyIiwiaWF0IjoxNzQyMzA5MjY3fQ.CqnpVG4-_GXVCdsWYOQ5P5unKtJcYt4JQA0AR1JmpC0",
  "accept": "application/json, text/plain, */*",
  "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36"
};

// API Endpoints
export default function () {
  group('External Trip APIs', function () {
    // 1. Fetch External Trip Details
    let tripDetailsResponse = http.get(
      `${BASE_URL}/v2/trip/tripDetailExternal?encrypted_trip_id=90427528c2ab8bf0773cdf`, 
      { headers }
    );
    
    check(tripDetailsResponse, {
      'trip details status is 200': (r) => r.status === 200,
      'trip details response body': (r) => r.body.length > 0,
      'trip details content-type': (r) => r.headers['Content-Type'].includes('application/json'),
      'trip details response time OK': (r) => r.timings.duration < 500
    }) || errors.add(1);
    requestDuration.add(tripDetailsResponse.timings.duration);

    // 2. Fetch Location List
    let locationListResponse = http.get(
      `${BASE_URL}/v1/trip/tripDetailExternal?encrypted_trip_id=90427528c2ab8bf0773cdf`, 
      { headers }
    );

    check(locationListResponse, {
      'location list status is 200': (r) => r.status === 200,
      'location list response body': (r) => r.body.length > 0,
      'location list content-type': (r) => r.headers['Content-Type'].includes('application/json'),
      'location list response time OK': (r) => r.timings.duration < 500
    }) || errors.add(1);
    requestDuration.add(locationListResponse.timings.duration);

    // 3. Fetch Trip Details
    let tripDetailsV2Response = http.get(
      `${BASE_URL}/v2/trip/tripDetailExternal?encrypted_trip_id=90427528c2ab8bf0773cdf`, 
      { headers }
    );

    check(tripDetailsV2Response, {
      'trip details v2 status is 200': (r) => r.status === 200,
      'trip details v2 response body': (r) => r.body.length > 0,
      'trip details v2 content-type': (r) => r.headers['Content-Type'].includes('application/json'),
      'trip details v2 response time OK': (r) => r.timings.duration < 500
    }) || errors.add(1);
    requestDuration.add(tripDetailsV2Response.timings.duration);

    // 4. Fetch Location Details External
    let locationDetailsResponse = http.get(
      `${BASE_URL}/v2/trip/locationDetailExternal?encrypted_trip_id=9b1f702f94fd88f1736b8fc2&page_no=1`, 
      { headers }
    );

    check(locationDetailsResponse, {
      'location details status is 200': (r) => r.status === 200,
      'location details response body': (r) => r.body.length > 0,
      'location details content-type': (r) => r.headers['Content-Type'].includes('application/json'),
      'location details response time OK': (r) => r.timings.duration < 500
    }) || errors.add(1);
    requestDuration.add(locationDetailsResponse.timings.duration);

    // Random sleep between 1-3 seconds to simulate real user behavior
    sleep(Math.random() * 2 + 1);
  });
}

// Optional: Export handled function for test teardown
export function handleSummary(data) {
  console.log('Test completed');
  return {
    stdout: JSON.stringify(data),
  };
}
