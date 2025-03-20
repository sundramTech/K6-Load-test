export const config = {
    BASE_URL: "https://dev-tracking.saudabooks.com",
  
    HEADERS: {
      "Content-Type": "application/json",
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjY3NTkwYmNkZmE5NjAzN2IyOTk5MDI4YzZmNzIyIiwiaWF0IjoxNzQyMzA5MjY3fQ.CqnpVG4-_GXVCdsWYOQ5P5unKtJcYt4JQA0AR1JmpC0",
    },
  
    ENDPOINTS: {
      CREATE_TRIP: "/v1/trip/createAndStart",
      TRIP_DETAIL: "/v2/trip/tripDetailExternal",
      EDIT_MOBILE: "/v1/trip/editMobileNumber",
      GET_API_KEY: "/v1/auth/getApiKey",
      EDIT_TRIP_ADDRESS: "/v1/trip/editTripAddress",
      LOCATION_DETAIL: "/v2/trip/locationDetailExternal",
      REFRESH_CONSENT: "/v1/trip/refreshConsent",
    },
  
    TRIP_IDS: {
      ENCRYPTED_TRIP_ID: "90427528c2ab8bf0773cdf",
      TRIP_NUMBER: "TRPFM25001561",
    },
  
    USER_CREDENTIALS: {
      EMAIL: "neeraj1@farmart.co",
      ENCRYPTED_TOKEN: "CYVRHQfYYrcScZJZDEIrdj4hGJnM5i0Zb2qiFOGhUbsNAFrwwLVidtIvTOy8R9yId/senQ40dnm4Zf9qL9g1gMn9cqCCWgRbTLSExIY5vxv7+vFO7qLbTIa9NlSemWvp2Elaz6RmScU6tjIeveTxDZvwICol4yFI16i/bnElJ/N8mVBZ2cp31BIWzzs9/NJwJ1/DfQSicOpQgedZUxV+6zg4OEeJ/0s/NoBNLGvJ9AgxjDEFFBYIJsG5rSq2MSGJ7wfdeQx2NWtx7sWht//jCAuVr0NjRZ5i3yGvrgB+2S9HILI7tI+9Kvapng/wlz6oVb+Bvo5OD/KYB51Kz09tHQ==",
    }
  };
  