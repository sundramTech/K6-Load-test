import http from 'k6/http';


export let options = {
  vus: 10, // 10 Virtual Users
  duration: '30s', // Test duration
  ext: {
    loadimpact: {
      projectID: 12345, // Optional
      name: "K6 Performance Test",
    }
  }
};

export default function () {
  http.get('https://test-api.k6.io');
}