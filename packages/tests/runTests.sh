#!/bin/bash

# Start anvil in the background
./runAnvil.sh &
ANVIL_PID=$!

# Function to check if anvil is ready
is_anvil_ready() {
    curl -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":67}' -H "Content-Type: application/json" http://127.0.0.1:8545 &>/dev/null
    return $?
}

# Function to kill anvil when the script exits
cleanup() {
    echo "Killing anvil..."
    kill $ANVIL_PID
}

# Set trap to call cleanup function when the script exits
trap cleanup EXIT

# Wait for anvil to be ready
echo "Waiting for anvil to be ready..."
while ! is_anvil_ready; do
    sleep 1
done
echo "Anvil is ready. Running tests..."

rm -rf ./dist
npx jest

# Wait for anvil to finish
wait $ANVIL_PID
