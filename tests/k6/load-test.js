import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Custom metrics
const getApiTrend = new Trend('get_api_duration');
const postApiTrend = new Trend('post_api_duration');
const computeTrend = new Trend('compute_duration');
const errorRate = new Rate('error_rate');

// Test options
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users for 1 minute
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    'get_api_duration': ['p(95)<300'], // 95% of GET requests should be below 300ms
    'post_api_duration': ['p(95)<400'], // 95% of POST requests should be below 400ms
    'compute_duration': ['p(95)<2000'], // 95% of compute requests should be below 2000ms
    'error_rate': ['rate<0.1'], // Error rate should be less than 10%
  },
};

export default function () {
  const baseUrl = 'http://localhost:3000';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  // GET health check
  let healthRes = http.get(`${baseUrl}/api/health`, params);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
    'health response has status': (r) => r.json().status === 'ok',
  });
  
  // GET all users
  let getStartTime = new Date().getTime();
  let usersRes = http.get(`${baseUrl}/api/users`, params);
  let getEndTime = new Date().getTime();
  
  getApiTrend.add(getEndTime - getStartTime);
  
  let checkResult = check(usersRes, {
    'get users status is 200': (r) => r.status === 200,
    'get users body is array': (r) => Array.isArray(r.json()),
  });
  
  if (!checkResult) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }
  
  // GET user by ID
  let userId = Math.floor(Math.random() * 3) + 1;
  let userRes = http.get(`${baseUrl}/api/users/${userId}`, params);
  check(userRes, {
    'get user status is 200': (r) => r.status === 200,
    'get user has id': (r) => r.json().id === userId,
  });
  
  // POST create user
  let payload = JSON.stringify({
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
  });
  
  let postStartTime = new Date().getTime();
  let createRes = http.post(`${baseUrl}/api/users`, payload, params);
  let postEndTime = new Date().getTime();
  
  postApiTrend.add(postEndTime - postStartTime);
  
  check(createRes, {
    'create user status is 201': (r) => r.status === 201,
    'create user returns id': (r) => r.json().id !== undefined,
  });

  // Test CPU intensive endpoint with varying complexity
  let complexity = Math.floor(Math.random() * 10) + 15; // Random between 15-24
  
  let computeStartTime = new Date().getTime();
  let computeRes = http.get(`${baseUrl}/api/compute/${complexity}`, params);
  let computeEndTime = new Date().getTime();
  
  computeTrend.add(computeEndTime - computeStartTime);
  
  check(computeRes, {
    'compute status is 200': (r) => r.status === 200,
    'compute returns result': (r) => r.json().result !== undefined,
  });
  
  sleep(1);
}
