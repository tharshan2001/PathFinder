# Performance Testing

This directory contains Artillery.io performance test configurations for the PathFinder API.

## Prerequisites

Install Artillery globally:

```bash
npm install -g artillery
# or
yarn global add artillery
```

## Test Configurations

### 1. Smoke Test (`smoke-test.yml`)
Quick validation of all endpoints under light load.
```bash
artillery run tests/performance/smoke-test.yml
```

### 2. Load Test (`load-test.yml`)
Comprehensive load testing with varied scenarios.
```bash
artillery run tests/performance/load-test.yml
```

### 3. Stress Test (`stress-test.yml`)
Gradual increase to identify breaking point.
```bash
artillery run tests/performance/stress-test.yml
```

### 4. Spike Test (`spike-test.yml`)
Test system response to sudden traffic spikes.
```bash
artillery run tests/performance/spike-test.yml
```

## Generate HTML Report

```bash
artillery run tests/performance/load-test.yml --output report.json
artillery report report.json
```

## Running All Tests

```bash
# Run smoke test
artillery run tests/performance/smoke-test.yml

# Run load test with report
artillery run tests/performance/load-test.yml --output results/load-test.json

# Run stress test
artillery run tests/performance/stress-test.yml

# Run spike test
artillery run tests/performance/spike-test.yml
```

## Test Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| Response Time (avg) | < 500ms | > 1000ms |
| Response Time (p95) | < 1000ms | > 2000ms |
| Error Rate | < 1% | > 5% |
| Throughput | > 50 req/s | < 20 req/s |

## Phases

- **Warm up**: Low traffic to establish baseline
- **Sustained load**: Normal expected traffic
- **Stress test**: Increasing load to find limits
- **Cool down**: Return to normal levels
