#!/bin/bash

rm -rf ./.contracts
mkdir ./.contracts

git clone https://github.com/CirclesUBI/circles-contracts-v2.git ./.contracts
cd ./.contracts
git checkout 20240129-erc1155-evaluation
forge build
cd ..

rm -rf ./abi
mkdir ./abi
cat ./.contracts/out/Graph.sol/Graph.json | jq .abi > ./abi/Graph.json
cat ./.contracts/out/MintSplitter.sol/MintSplitter.json | jq .abi > ./abi/MintSplitter.json
cat ./.contracts/out/GroupCircle.sol/GroupCircle.json | jq .abi > ./abi/GroupCircle.json
cat ./.contracts/out/TimeCircle.sol/TimeCircle.json | jq .abi > ./abi/TimeCircle.json
cat ./.contracts/out/Hub.sol/Hub.json | jq .abi > ./abi/Hub.json
cat ./.contracts/out/Hub.sol/WrappedERC20.json | jq .abi > ./abi/WrappedERC20.json

rm -rf ./.contracts
