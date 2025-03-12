import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '1m',
  ext: {
    loadimpact: {
      projectID: 1234567,
      name: "My Load Test"
    },
    influxDB: {
      address: 'http://localhost:8086',
      database: 'k6'
    }
  }
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/posts');
  sleep(1);
}