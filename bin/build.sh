#!/usr/bin/env bash

set -e

lerna exec --stream yarn build
