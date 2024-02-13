#!/bin/bash

# The default private key for the first account in anvil:
PRIVATE_KEY='0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
ANVIL_PORT=8545
ANVIL_URL=http://127.0.0.1:$ANVIL_PORT

# Make sure the submodules are initialized
git submodule update --init --recursive --remote

# Build the v1 contracts
cd ./circles-contracts-v1
npm install
forge build

# Build the v2 contracts
cd ../circles-contracts-v2
forge build
cd ..

# Run anvil in the background
anvil --port $ANVIL_PORT --gas-limit 8000000 --accounts 1000 &
ANVIL_PID=$!

echo "Waiting for anvil to be ready..."
is_anvil_ready() {
    curl -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' -H "Content-Type: application/json" $ANVIL_URL &>/dev/null
    return $?
}
while ! is_anvil_ready; do
   sleep 1
done
echo "Anvil is ready. Deploying contracts..."

# Deploy the v1 contracts using `forge create`
echo "Deploying V1 Hub ..."
V1_HUB_INFLATION="107"
V1_HUB_PERIOD="31556952"
V1_HUB_SYMBOL="CRC"
V1_HUB_NAME="Circles"
V1_HUB_SIGNUP_BONUS="50000000000000000000"
V1_HUB_INITIAL_ISSUANCE="92592592592592"
V1_HUB_TIMEOUT="7776000"

cd circles-contracts-v1/contracts
V1_HUB_DEPLOYMENT=$(forge create Hub \
  --rpc-url ${ANVIL_URL} \
  --private-key ${PRIVATE_KEY} \
  --constructor-args ${V1_HUB_INFLATION} ${V1_HUB_PERIOD} ${V1_HUB_SYMBOL} ${V1_HUB_NAME} ${V1_HUB_SIGNUP_BONUS} ${V1_HUB_INITIAL_ISSUANCE} ${V1_HUB_TIMEOUT})

V1_HUB_ADDRESS=$(echo "$V1_HUB_DEPLOYMENT" | grep "Deployed to:" | awk '{print $3}')
echo "V1 Hub deployed at ${V1_HUB_ADDRESS}"

# Deploy the v2 contracts using `forge create`
echo "Deploying V2 Hub ..."
cd ../../circles-contracts-v2/src/hub
V2_HUB_V1_HUB=${V1_HUB_ADDRESS}
V2_DEMURRAGE_ZERO_DAY=1602786330
V2_HUB_STANDARD_TREASURY="0x1234567890123456789012345678901234567890"
V2_HUB_BOOTSTRAP_TIME=15552000 # 180 days
V2_HUB_FALLBACK_URL="https://example.com"

V2_HUB_DEPLOYMENT=$(forge create Hub \
  --rpc-url ${ANVIL_URL} \
  --private-key ${PRIVATE_KEY} \
  --constructor-args ${V2_HUB_V1_HUB} ${V2_DEMURRAGE_ZERO_DAY} ${V2_HUB_STANDARD_TREASURY} ${V2_HUB_BOOTSTRAP_TIME} ${V2_HUB_FALLBACK_URL})
V2_HUB_ADDRESS=$(echo "$V2_HUB_DEPLOYMENT" | grep "Deployed to:" | awk '{print $3}')
echo "V2 Hub deployed at ${V2_HUB_ADDRESS}"

echo ""
echo "Summary:"
echo "========"
echo "V1 Hub: $V1_HUB_ADDRESS"
echo "V2 Hub: $V2_HUB_ADDRESS"
echo ""

# Wait for keypress to kill anvil
echo "Press any key to kill anvil..."
read -n 1 -s
kill $ANVIL_PID
