#!/bin/bash
# This script is used to build the v1 and v2 contracts.
# The output (especially the ABIs) are used in other sdk packages.
#
# Because the v1 contracts won't build if they're part of a npm workspace,
# we need to remove the workspace before build and then add it back.
# This is ugly and the v1 package should be updated to be compatible with workspaces.

# Make sure v1 and v2 contract code is available
git submodule update --init --recursive --remote

# Remove the v1 package from the workspaces
jq 'del(.workspaces[0])' package.json > temp.package.json
mv temp.package.json package.json
npm install

# Build the v1 contracts
cd ./packages/circles-contracts
npm install
forge build
cd ../..

# Insert the v1 package back into the workspaces
jq '.workspaces |= if index("packages/circles-contracts") then . else ["packages/circles-contracts"] + . end' package.json > temp.package.json
mv temp.package.json package.json

# Build the v2 contracts
cd ./packages/circles-contracts-v2
forge build