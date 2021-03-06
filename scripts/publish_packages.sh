#!/usr/bin/env bash

set -euo pipefail

npm publish --cwd ./packages/api-bcc-db-hasura  && \
npm publish --cwd ./packages/cli  && \
npm publish --cwd ./packages/client-ts  && \
npm publish --cwd ./packages/server  && \
npm publish --cwd ./packages/util  && \
npm publish --cwd ./packages/util-dev
