#/bin/bash
set -e

ROOT=$(dirname $0)/..

DOCKER_COMPOSE_FILE_PATH=$ROOT/docker-compose.local.yml

yarn env-cmd -f $ROOT/env/local.env docker-compose -f $DOCKER_COMPOSE_FILE_PATH "$@"
