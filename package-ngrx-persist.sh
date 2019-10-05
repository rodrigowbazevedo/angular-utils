#!/bin/bash

ng build @rodrigowba/ngrx-persist

echo "Building Schematics"

cd projects/rodrigowba/ngrx-persist

npm install

tsc -p tsconfig.schematics.json

rm -rf node_modules

echo "Copying collections to dist"

cp collection.json ../../../dist/rodrigowba/ngrx-persist
