FROM python:3.9-alpine

ENV PYTHONUNBUFFERED 1

WORKDIR /backend


COPY . /backend/

RUN rm /backend/backend/.env

EXPOSE $BACKEND_PORT

RUN pip install -r requirements.txt

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && sed -i 's/\r$//' /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

