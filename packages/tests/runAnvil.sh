#!/bin/bash
if [ -d "./.contracts" ]; then
  cd ./.contracts
  git pull
else
  mkdir ./.contracts
  git clone https://github.com/CirclesUBI/circles-contracts-v2.git ./.contracts
  cd ./.contracts
fi

git checkout develop
forge build

chmod +x ./runInAnvil.sh
./runInAnvil.sh
