import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50, // 50 Virtual Users
  duration: '1m', // Run for 1 minute
};

export default function () {
  let res = http.get('https://jsonplaceholder.typicode.com/posts');
  console.log(`Response time: ${res.timings.duration} ms`);
  sleep(1);
}