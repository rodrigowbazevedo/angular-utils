#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/ngrx-persist --configuration production

echo "Building Schematics"

cd projects/rodrigowba/ngrx-persist

npm install

tsc -p tsconfig.schematics.json

rm -rf node_modules

echo "Copying collections to dist"

cp collection.json ../../../dist/rodrigowba/ngrx-persist
