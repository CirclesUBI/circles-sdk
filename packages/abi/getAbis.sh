#!/bin/bash

rm -rf ./.contracts
mkdir ./.contracts

git clone https://github.com/CirclesUBI/circles-contracts-v2.git ./.contracts
cd ./.contracts
forge build
cd ..

mkdir ./abi
cat ./.contracts/out/Graph.sol/Graph.json | jq .abi > ./abi/Graph.json
cat ./.contracts/out/MintSplitter.sol/MintSplitter.json | jq .abi > ./abi/MintSplitter.json
cat ./.contracts/out/GroupCircle.sol/GroupCircle.json | jq .abi > ./abi/GroupCircle.json
cat ./.contracts/out/TimeCircle.sol/TimeCircle.json | jq .abi > ./abi/TimeCircle.json

rm -rf ./.contracts