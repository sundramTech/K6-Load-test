import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,  // 10 virtual users
  duration: '30s', // Run for 30 seconds
};

export default function () {
  let url = 'https://stage.saudabooks.com/v1/map/direction?origin=28.63587813404002%2C77.50655660125601&destination=22.7300397802915%2C75.8089406302915&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmFmNzY3OGQ3YzNjYzMzODEiLCJpYXQiOjE3MzYxNjE5OTd9.AYLJ693bHwCky3YuJH4eL1vajZYfie-HKEAdlqAJmow';

  let params = {
    headers: {
      "sec-ch-ua-platform": '"Android"',
      "Referer": "https://stage-saudabook.farmart.co/",
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      "sec-ch-ua-mobile": "?1"
    }
  };

  let response = http.get(url, params);

  check(response, {
    "Status is 200": (r) => r.status === 200,
    "Response body is not empty": (r) => r.body.length > 0,
  });

  sleep(1);
}
