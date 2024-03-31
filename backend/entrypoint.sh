#!/bin/sh
# wait for database to be ready
echo "Waiting for the database to be ready for $SECONDS_TO_WAIT_FOR_DB seconds..."
sleep $SECONDS_TO_WAIT_FOR_DB


python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:$BACKEND_PORT &

# wait for the server to start
echo "Waiting for the server to start for $SECONDS_TO_START_DEMO_INIT seconds..."
sleep $SECONDS_TO_START_DEMO_INIT

# execute the initialization command
python manage.py initialize_demo

# keep the container running
wait $!
