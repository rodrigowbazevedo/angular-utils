#!/bin/bash

ng build @rodrigowba/env

echo "Building Schematics"

cd projects/rodrigowba/env

tsc -p tsconfig.schematics.json

echo "Copying collections to dist"

cp collection.json ../../../dist/rodrigowba/env
