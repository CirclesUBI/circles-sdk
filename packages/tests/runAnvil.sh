#!/bin/bash
git clone git@github.com:CirclesUBI/circles-contracts-v2.git
cd circles-contracts-v2
git checkout 20240129-erc1155-evaluation
forge build
chmod +x ./runInAnvil.sh
./runInAnvil.sh
