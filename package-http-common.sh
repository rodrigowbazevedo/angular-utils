#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/http-common --configuration production

echo "Building Schematics"

cd projects/rodrigowba/http-common

npm install

tsc -p tsconfig.schematics.json

rm -rf node_modules

echo "Copying collections to dist"

cp collection.json ../../../dist/rodrigowba/http-common
