#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/ngrx-utils --configuration production
