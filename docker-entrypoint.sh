#!/bin/sh
set -eu

node dist/db/prepare.js
exec node dist/server.js