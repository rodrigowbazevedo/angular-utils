#!/bin/bash
set -e
set -o pipefail

ng build @rodrigowba/form-utils --configuration production
