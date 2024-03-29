#!/bin/bash
set -e

PG_CONF="/var/lib/postgresql/data/postgresql.conf"

if ! grep -q "Custom Configuration Start" "$PG_CONF"; then
  echo "Applying custom configuration to $PG_CONF"
  cat >> "$PG_CONF" <<EOF

# Custom Configuration Start
include '/tmp/postgresql.conf'
# Custom Configuration End
EOF
fi
