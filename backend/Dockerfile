FROM python:3.9-alpine

ENV PYTHONUNBUFFERED 1

WORKDIR /backend

COPY requirements.txt /backend/
COPY manage.py /backend/
ADD backend_app/ /backend/backend_app
ADD backend/ /backend/backend

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Start the development server
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py initialize_workers && python manage.py runserver 0.0.0.0:$BACKEND_PORT"]

