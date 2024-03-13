#!/bin/bash
cd codegen
npx tsc
node dist/main.js \
  ../packages/circles-contracts/out/Hub.sol/Hub.json \
  ../packages/abi-v1/src/ \
  V1Hub

node dist/main.js \
  ../packages/circles-contracts/out/Token.sol/Token.json \
  ../packages/abi-v1/src/ \
  V1Token

node dist/main.js \
  ../packages/circles-contracts-v2/out/Hub.sol/Hub.json \
  ../packages/abi-v2/src/ \
  V2Hub