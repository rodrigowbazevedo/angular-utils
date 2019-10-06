#!/bin/bash

ng build @rodrigowba/http-common

echo "Building Schematics"

cd projects/rodrigowba/http-common

npm install

tsc -p tsconfig.schematics.json

rm -rf node_modules

echo "Copying collections to dist"

cp collection.json ../../../dist/rodrigowba/http-common
