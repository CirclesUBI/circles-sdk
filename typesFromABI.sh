#!/bin/bash
npx typechain --discriminate-types --out-dir ./packages/abi-v1/src --target=ethers-v6 contracts/circles-contracts/out/Hub.sol/*.json
npx typechain --discriminate-types --out-dir ./packages/abi-v1/src --target=ethers-v6 contracts/circles-contracts/out/Token.sol/*.json
npx typechain --discriminate-types --out-dir ./packages/abi-v2/src --target=ethers-v6 contracts/circles-contracts-v2/out/Hub.sol/*.json
