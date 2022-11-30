#!/usr/bin/env bash

ROOT_DIR=$(dirname $0)/../../..

APP_DIR=$(dirname $0)/..

yarn env-cmd -f $ROOT_DIR/env/local.env ts-node -P "$APP_DIR/tsconfig.json" --files -r tsconfig-paths/register "$@"
