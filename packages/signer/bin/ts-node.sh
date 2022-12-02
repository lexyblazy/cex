#!/usr/bin/env bash

ROOT=$(dirname $0)/..

yarn ts-node -P "$ROOT/tsconfig.json" --files -r tsconfig-paths/register $@
