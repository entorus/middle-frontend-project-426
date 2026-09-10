#!/bin/sh
set -eu

node dist/db/prepare.js
exec node --require ./dist/instrument.js dist/server.js