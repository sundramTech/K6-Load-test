export let options = {
    stages: [
      { duration: '10s', target: 10 }, // Start with 10 users
      { duration: '20s', target: 50 }, // Increase to 50 users
      { duration: '10s', target: 0 },  // Ramp down to 0 users
    ],
  };
  
  export default function () {
    http.get('https://test-api.k6.io');
  }
  