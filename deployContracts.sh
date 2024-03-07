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

# Remove the v1 package from the workspaces
jq 'del(.workspaces[0])' package.json > temp.package.json
mv temp.package.json package.json

cd ./packages/circles-contracts
npm install @openzeppelin/contracts@^3.4.0-solc-0.7
npm install @gnosis.pm/safe-contracts@^1.3.0
npm install @circles/safe-contracts@=1.0.14
forge build

echo "Deploying V1 Hub ..."

# Default values are used if variables not set by .env file
V1_HUB_INFLATION="${V1_HUB_INFLATION}"
V1_HUB_PERIOD="${V1_HUB_PERIOD}"
V1_HUB_SYMBOL="${V1_HUB_SYMBOL}"
V1_HUB_NAME="${V1_HUB_NAME}"
V1_HUB_SIGNUP_BONUS="${V1_HUB_SIGNUP_BONUS}"
V1_HUB_INITIAL_ISSUANCE="${V1_HUB_INITIAL_ISSUANCE}"
V1_HUB_TIMEOUT="${V1_HUB_TIMEOUT}"

cd contracts
V1_HUB_DEPLOYMENT=$(forge create Hub \
  --rpc-url ${RPC_URL} \
  --private-key ${PRIVATE_KEY} \
  --constructor-args ${V1_HUB_INFLATION} ${V1_HUB_PERIOD} ${V1_HUB_SYMBOL} ${V1_HUB_NAME} ${V1_HUB_SIGNUP_BONUS} ${V1_HUB_INITIAL_ISSUANCE} ${V1_HUB_TIMEOUT})

V1_HUB_ADDRESS=$(echo "$V1_HUB_DEPLOYMENT" | grep "Deployed to:" | awk '{print $3}')
echo "V1 Hub deployed at ${V1_HUB_ADDRESS}"

# Insert the v1 package back into the workspaces
cd ../../..
jq '.workspaces |= if index("packages/circles-contracts") then . else ["packages/circles-contracts"] + . end' package.json > temp.package.json
mv temp.package.json package.json

cd packages/circles-contracts-v2/src
echo "Deploying Migration contract ..."
cd migration
MIGRATION_V1_HUB=${V1_HUB_ADDRESS}

MIGRATION_DEPLOYMENT=$(forge create Migration \
  --rpc-url ${RPC_URL} \
  --private-key ${PRIVATE_KEY} \
  --constructor-args ${MIGRATION_V1_HUB})
MIGRATION_ADDRESS=$(echo "$MIGRATION_DEPLOYMENT" | grep "Deployed to:" | awk '{print $3}')
if [ -z "$MIGRATION_ADDRESS" ]; then
  echo "Error: Migration contract was not deployed."
  exit 1
fi
echo "Migration deployed at ${MIGRATION_ADDRESS}"


# Deploy the v2 contracts using `forge create`
echo "Deploying V2 Hub ..."
cd ../hub
V2_HUB_V1_HUB=${V1_HUB_ADDRESS}
V2_HUB_MIGRATION=${MIGRATION_ADDRESS}
V2_DEMURRAGE_ZERO_DAY="${V2_DEMURRAGE_ZERO_DAY}"
V2_HUB_STANDARD_TREASURY="${V2_HUB_STANDARD_TREASURY}"
V2_HUB_BOOTSTRAP_TIME="${V2_HUB_BOOTSTRAP_TIME}" # 180 days
V2_HUB_FALLBACK_URL="${V2_HUB_FALLBACK_URL}"

V2_HUB_DEPLOYMENT=$(forge create Hub \
  --rpc-url ${RPC_URL} \
  --private-key ${PRIVATE_KEY} \
  --constructor-args ${V2_HUB_V1_HUB} ${V2_HUB_MIGRATION} ${V2_DEMURRAGE_ZERO_DAY} ${V2_HUB_STANDARD_TREASURY} ${V2_HUB_BOOTSTRAP_TIME} ${V2_HUB_FALLBACK_URL})
V2_HUB_ADDRESS=$(echo "$V2_HUB_DEPLOYMENT" | grep "Deployed to:" | awk '{print $3}')
echo "V2 Hub deployed at ${V2_HUB_ADDRESS}"

echo ""
echo "Summary:"
echo "========"
echo "V1 Hub: $V1_HUB_ADDRESS"
echo "Migration: $MIGRATION_ADDRESS"
echo "V2 Hub: $V2_HUB_ADDRESS"
echo ""
