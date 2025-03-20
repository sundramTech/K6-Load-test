export const spikeTest = {
    stages: [
      { duration: '10s', target: 100 }, // Rapid spike
      { duration: '10s', target: 0 },   // Ramp down
    ],
    thresholds: {
      http_req_duration: ['p(95)<2000'],
    },
  };
  
  export const loadTest = {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(95)<500'],
    },
  };
  
  export const stressTest = {
    stages: [
      { duration: '1m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '2m', target: 200 },
      { duration: '2m', target: 100 },
      { duration: '1m', target: 50 },
      { duration: '30s', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(95)<3000'],
    },
  };
  