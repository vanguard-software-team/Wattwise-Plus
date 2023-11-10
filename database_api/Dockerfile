FROM python:3.9-alpine

ENV PYTHONUNBUFFERED 1

WORKDIR /database_api

COPY requirements.txt /database_api/
COPY manage.py /database_api/
ADD database_api_app/ /database_api/database_api_app
ADD database_api/ /database_api/database_api

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Start the development server
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:9000"]

