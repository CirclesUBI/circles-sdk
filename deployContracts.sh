#!/bin/bash

# Function to load environment variables from file
load_env() {
    if [ -f "$1" ]; then
        echo "Loading environment variables from $1"
        export $(cat "$1" | sed 's/#.*//g' | xargs)
    else
        echo "Error: Environment file $1 not found."
        exit 1
    fi
}

# Check if an environment file was supplied as an argument
if [ $# -eq 0 ]; then
    # No arguments supplied, default to .env if it exists
    if [ -f ".env" ]; then
        load_env ".env"
    else
        echo "No environment file supplied and default .env file not found."
        # It's not mandatory to exit here if you have defaults in the script
    fi
else
    # Load the specified environment file
    load_env "$1"
fi

echo "Deploying V1 Hub ..."

# Default values are used if variables not set by .env file
V1_HUB_INFLATION="${V1_HUB_INFLATION}"
V1_HUB_PERIOD="${V1_HUB_PERIOD}"
V1_HUB_SYMBOL="${V1_HUB_SYMBOL}"
V1_HUB_NAME="${V1_HUB_NAME}"
V1_HUB_SIGNUP_BONUS="${V1_HUB_SIGNUP_BONUS}"
V1_HUB_INITIAL_ISSUANCE="${V1_HUB_INITIAL_ISSUANCE}"
V1_HUB_TIMEOUT="${V1_HUB_TIMEOUT}"

cd packages/circles-contracts/
mkdir contracts
cd contracts
V1_HUB_DEPLOYMENT=$(forge create Hub \
  --rpc-url ${RPC_URL} \
  --private-key ${PRIVATE_KEY} \
  --constructor-args ${V1_HUB_INFLATION} ${V1_HUB_PERIOD} ${V1_HUB_SYMBOL} ${V1_HUB_NAME} ${V1_HUB_SIGNUP_BONUS} ${V1_HUB_INITIAL_ISSUANCE} ${V1_HUB_TIMEOUT})

V1_HUB_ADDRESS=$(echo "$V1_HUB_DEPLOYMENT" | grep "Deployed to:" | awk '{print $3}')
echo "V1 Hub deployed at ${V1_HUB_ADDRESS}"

# Deploy the v2 contracts using `forge create`
echo "Deploying V2 Hub ..."
cd ../../circles-contracts-v2/src/hub
V2_HUB_V1_HUB=${V1_HUB_ADDRESS}
V2_DEMURRAGE_ZERO_DAY="${V2_DEMURRAGE_ZERO_DAY}"
V2_HUB_STANDARD_TREASURY="${V2_HUB_STANDARD_TREASURY}"
V2_HUB_BOOTSTRAP_TIME="${V2_HUB_BOOTSTRAP_TIME}" # 180 days
V2_HUB_FALLBACK_URL="${V2_HUB_FALLBACK_URL}"

V2_HUB_DEPLOYMENT=$(forge create Hub \
  --rpc-url ${RPC_URL} \
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
