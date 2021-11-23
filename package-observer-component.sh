#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/observer-component --configuration production
