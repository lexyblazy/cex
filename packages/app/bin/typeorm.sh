#!/usr/bin/env bash

ROOT_DIR=$(dirname $0)/../../..

yarn build

yarn env-cmd -f $ROOT_DIR/env/local.env yarn typeorm "$@"
