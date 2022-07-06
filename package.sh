#!/bin/bash
set -e
set -o pipefail

npm run package:env
npm run package:ngrx-persist
npm run package:ngrx-i18n
npm run package:http-common
npm run package:observer-component
npm run package:pipes
npm run package:form-utils
