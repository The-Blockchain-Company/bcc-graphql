#!/usr/bin/env bash

PROJECT_NAME=${1:-bcc-graphql}

docker ps \
  -f name="$PROJECT_NAME_postgres" \
  -f name="$PROJECT_NAME_bcc-node" \
  -f name="$PROJECT_NAME_bcc-db-sync-extended" \
  -f name="$PROJECT_NAME_hasura" \
  -f name="$PROJECT_NAME_bcc-graphql" \
  --format '{{.Names}}' | wc -l
