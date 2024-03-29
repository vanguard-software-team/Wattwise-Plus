FROM timescale/timescaledb:latest-pg14

COPY postgresql.conf /tmp/postgresql.conf
COPY entrypoint.sh /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/entrypoint.sh
