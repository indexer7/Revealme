#!/usr/bin/env bash
set -e
cp env.example .env
mkdir -p data/postgres data/spiderfoot data/reports
docker-compose up -d 