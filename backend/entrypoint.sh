#!/bin/sh

# This script is for a production Django application.
# It handles database migration and serves the app using Gunicorn.
# Assumes a web server like Nginx is configured to proxy requests to Gunicorn.

# Set the number of Gunicorn worker processes.
# A common rule is (2 * number of CPU cores) + 1.
# You can adjust this based on your server's resources.
NUM_WORKERS=3

# Set the host and port for Gunicorn.
# Gunicorn will listen on this address. Nginx will proxy to this.
HOST=0.0.0.0
PORT=$BACKEND_PORT

# Wait for the database to be ready.
# This prevents the application from trying to connect to a non-existent database.
echo "Waiting for the database to be ready..."
/usr/bin/wait-for-it.sh db:5432 -t 30

# Collect static files.
# This is a crucial step for production to serve static assets correctly.
# Make sure your STATIC_ROOT is configured in settings.py.
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Apply database migrations.
# This ensures the database schema is up to date with your models.
echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

# Start Gunicorn.
# The --bind flag specifies the host and port to listen on.
# The --workers flag sets the number of worker processes.
# The 'backend.wsgi' part should be replaced with your project's WSGI module path.
echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application \
  --bind 0.0.0.0:$BACKEND_PORT \
  --workers 4