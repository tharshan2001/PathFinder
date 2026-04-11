#!/bin/bash

# Performance Testing Script for PathFinder API
# Run this script to execute all performance tests

echo "==================================="
echo "PathFinder Performance Testing Suite"
echo "==================================="

# Check if artillery is installed
if ! command -v artillery &> /dev/null; then
    echo "Artillery not found. Installing..."
    npm install -g artillery
fi

# Create results directory
mkdir -p results

echo ""
echo "1. Running Smoke Test..."
artillery run tests/performance/smoke-test.yml --output results/smoke-test.json
echo "Smoke test completed!"

echo ""
echo "2. Running Load Test..."
artillery run tests/performance/load-test.yml --output results/load-test.json
echo "Load test completed!"

echo ""
echo "3. Running Stress Test..."
artillery run tests/performance/stress-test.yml --output results/stress-test.json
echo "Stress test completed!"

echo ""
echo "4. Running Spike Test..."
artillery run tests/performance/spike-test.yml --output results/spike-test.json
echo "Spike test completed!"

echo ""
echo "==================================="
echo "All tests completed!"
echo "Results saved in ./results/"
echo "==================================="

# Generate summary report
echo ""
echo "Generating summary report..."
echo "-------------------------------"
for file in results/*.json; do
    if [ -f "$file" ]; then
        echo "File: $file"
        # Extract basic metrics using jq if available
        if command -v jq &> /dev/null; then
            jq '{duration: .summary.duration, phasesComplete: .summary.phases.length, totalRequests: .summary.requests.total, errors: .summary.errors}' "$file" 2>/dev/null || echo "  (jq parsing failed)"
        fi
    fi
done
