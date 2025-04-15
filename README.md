# Performance Test API

This is a simple API server designed for performance testing with JMeter and K6.

## Project Structure

```
project/
├── src/              # API server code
├── tests/
│   ├── jmeter/       # JMeter test plans
│   └── k6/           # K6 test scripts
├── scripts/          # Helper scripts
├── Dockerfile        # For containerization
├── docker-compose.yml
└── package.json
```

## Prerequisites

- Node.js 14+ and npm
- JMeter (for running JMeter tests)
- K6 (for running K6 tests)
- Docker and Docker Compose (optional, for containerized deployment)

## Getting Started

### Local Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   Or use the setup script:
   ```
   ./scripts/setup.sh
   ```
4. The server will be running at http://localhost:3000

### Using Docker

1. Build and run using Docker Compose:
   ```
   docker-compose up -d
   ```
2. The server will be running at http://localhost:3000

## Running Performance Tests

### JMeter Tests

1. Open JMeter
2. Load the test plan from `tests/jmeter/test-plan.jmx`
3. Configure the host and port if necessary
4. Run the test

### K6 Tests

1. Ensure K6 is installed
2. Run the test script:
   ```
   k6 run tests/k6/load-test.js
   ```

## API Endpoints

- `GET /api/health`: Health check endpoint
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create a new user
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user
- `GET /api/compute/:complexity`: CPU-intensive endpoint (for stress testing)

## Test Configuration

Both the JMeter test plan and K6 script are pre-configured to test the API endpoints with varying load patterns.

### JMeter Configuration

- 100 threads (virtual users)
- 30 second ramp-up time
- 10 iterations per thread

### K6 Configuration

- Stage 1: Ramp up to 20 users over 30 seconds
- Stage 2: Stay at 20 users for 1 minute
- Stage 3: Ramp up to 50 users over 30 seconds
- Stage 4: Stay at 50 users for 1 minute
- Stage 5: Ramp down to 0 users over 30 seconds

## Customizing Tests

Feel free to modify the test configurations to suit your specific testing needs.
