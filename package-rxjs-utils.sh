#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/rxjs-utils --configuration production
