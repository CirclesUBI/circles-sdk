#!/bin/bash

if [ -d "./contracts" ]; then
  cd ./contracts
  git pull
else
  mkdir ./.contracts
  git clone https://github.com/CirclesUBI/circles-contracts-v2.git ./.contracts
  cd ./.contracts
fi

git checkout dev
forge build

cd ..

rm -rf ./abi
mkdir ./abi

cat ./.contracts/out/Hub.sol/Hub.json | jq .abi > ./abi/Hub.json
cat ./.contracts/out/Hub.sol/WrappedERC20.json | jq .abi > ./abi/WrappedERC20.json

rm -rf ./.contracts
