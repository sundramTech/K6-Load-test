# K6 Performance Testing Guide


## Installation

### macOS
```bash
brew install k6
```

### Linux (Debian/Ubuntu)
```bash
sudo gpg -k 379CE192D401AB61
curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update
sudo apt install k6
```

### Windows
Using Chocolatey:
```bash
choco install k6
```

Using Scoop:
```bash
scoop install k6
```

### Verify Installation
```bash
k6 version
```

## Basic Usage

### Writing Your First Test
Create a file named `script.js`:

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 10,      // 10 virtual users
  duration: '30s' // Run for 30 seconds
};

export default function () {
  let res = http.get('https://test-api.k6.io/public/crocodiles/');
  console.log(`Response time: ${res.timings.duration} ms`);
  sleep(1);
}
```

### Running Tests
```bash
k6 run script.js
```

### Understanding Results
K6 provides real-time metrics including:
- **checks**: Pass/fail ratio of test conditions
- **http_req_duration**: Response time statistics
- **http_reqs**: Total request count
- **vus**: Number of virtual users
- **iterations**: Test scenario execution count

## Advanced Testing

### Creating an Interdependent Workflow

K6 allows you to create multi-stage load testing workflows. We'll demonstrate this using a mock API to perform:
1. Load Testing - Normal user load simulation
2. Stress Testing - System limits testing
3. Spike Testing - Sudden traffic surge simulation

#### Mock API Setup
For these examples, we'll use JSONPlaceholder as our mock API:
`https://jsonplaceholder.typicode.com`

### Load Testing Workflow
Create `load_test.js`:
```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50,        // 50 Virtual Users
  duration: '1m', // Run for 1 minute
};

export default function () {
  let res = http.get('https://jsonplaceholder.typicode.com/posts');
  console.log(`Response time: ${res.timings.duration} ms`);
  sleep(1);
}
```

Run with:
```bash
k6 run load_test.js
```

### Stress Testing Workflow
Create `stress_test.js`:
```javascript
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp-up to 50 users
    { duration: '20s', target: 200 }, // Increase to 200 users
    { duration: '10s', target: 0 },   // Ramp-down
  ],
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/posts');
}
```

Run with:
```bash
k6 run stress_test.js
```

### Spike Testing Workflow
Create `spike_test.js`:
```javascript
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '5s', target: 10 },   // Normal traffic
    { duration: '5s', target: 500 },  // Sudden spike
    { duration: '10s', target: 10 },  // Drop back
  ],
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/posts');
}
```

Run with:
```bash
k6 run spike_test.js
```

## CI/CD Integration

K6 can be integrated with various CI/CD platforms:
- Jenkins
- GitHub Actions
- GitLab CI
- Docker

### Docker Example
```bash
docker run -i loadimpact/k6 run - <script.js
```

### GitHub Actions Integration
Create `.github/workflows/k6-tests.yml`:
```yaml
name: K6 Load Testing

on:  
  push:  
    branches: [ main ]  
  pull_request:  
    branches: [ main ]  

jobs:  
  load-test:  
    runs-on: ubuntu-latest  
    steps:  
      - name: Checkout Repository  
        uses: actions/checkout@v2  

      - name: Update Package List  
        run: sudo apt-get update  

      - name: Install K6  
        run: |
          sudo apt-get install -y gnupg
          curl -s https://dl.k6.io/key.gpg | sudo apt-key add -
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install -y k6  

      - name: Run Load Test  
        run: k6 run tests/load_test.js 
```

## Monitoring

### InfluxDB + Grafana Setup
1. Install InfluxDB and Grafana
2. Configure K6 to send metrics to InfluxDB
3. Connect Grafana to InfluxDB for visualization

Example configuration:
```javascript
export let options = {
  ext: {
    loadimpact: {
      projectID: 123456,
      name: "My Load Test"
    }
  }
};
```

## Best Practices

1. **Modular Test Scripts**
   - Break down tests into reusable components
   - Maintain separate files for different test scenarios

2. **Define Thresholds**
```javascript
export let options = {
  thresholds: {
    http_req_duration: ['p(95)<200'] // 95% of requests should be under 200ms
  }
};
```

3. **Test Data Management**
   - Use parameterized tests
   - Externalize test data
   - Handle credentials securely

4. **Realistic Testing**
   - Implement proper wait times using `sleep()`
   - Simulate real user behavior
   - Consider geographic distribution

5. **Monitoring Integration**
   - Use monitoring tools like:
     - Grafana
     - Prometheus
     - Datadog