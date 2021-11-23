#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/env --configuration production

echo "Building Schematics"

cd projects/rodrigowba/env

tsc -p tsconfig.schematics.json

echo "Copying collections to dist"

cp collection.json ../../../dist/rodrigowba/env
