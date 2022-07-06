#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/pipes --configuration production
