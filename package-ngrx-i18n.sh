#!/bin/bash

ng build @rodrigowba/ngrx-i18n --prod

echo "Building Schematics"

cd projects/rodrigowba/ngrx-i18n

npm install

tsc -p tsconfig.schematics.json

rm -rf node_modules

echo "Copying collections to dist"

cp collection.json ../../../dist/rodrigowba/ngrx-i18n
