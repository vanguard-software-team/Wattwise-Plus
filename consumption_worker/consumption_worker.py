import redis
import os
from backend_service_data_fetch import DataFetchService
from data_generation import get_kwh_for_date_range
from datetime import timedelta
from datetime import datetime
import time
import json

REDIS_HOST = os.environ.get('REDIS_HOST')
REDIS_PORT = int(os.environ.get('REDIS_PORT'))
REDIS_CLIENT = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
WORKER_NAME = os.environ.get('CONSUMPTION_WORKER_NAME', "consumption_worker")
BACKEND_URL = "http://backend:" + os.environ.get('BACKEND_PORT')
LOGIN_BACKEND_URL = BACKEND_URL + "/login/"
TOKEN_REFRESH_URL = BACKEND_URL + "/token/refresh/"
LAST_CONSUMPTION_URL = BACKEND_URL + "/worker/get/consumers/last/consumption"
WRITE_CONSUMPTION_DATA_URL = BACKEND_URL + "/worker/add/consumer/consumption"
LOGIN_PAYLOAD = {
    'email': os.environ.get('WATTWISE_WORKER_EMAIL'),
    'password': os.environ.get('WATTWISE_WORKER_PASSWORD')
}
WORKER_LIST_KEY = f"list_{WORKER_NAME}"


def write_data_in_batches(data, batch_size=1000):
    """
    Write data to the backend service in batches.
    """
    total_batches = len(data) // batch_size + (1 if len(data) % batch_size > 0 else 0)
    for i in range(total_batches):
        start_index = i * batch_size
        end_index = start_index + batch_size
        batch_data = data[start_index:end_index]
        response = consumption_service.write_data(batch_data)
        attempt_count = 0
        while response is False and attempt_count < 5:
            response = consumption_service.write_data(batch_data)
            attempt_count += 1
        if response:
            print(f"Batch {i+1}/{total_batches} written successfully")
        else:
            print(f"Failed to write Batch {i+1}/{total_batches} after {attempt_count} attempts")


consumption_service = DataFetchService(BACKEND_URL, LOGIN_BACKEND_URL,TOKEN_REFRESH_URL, LAST_CONSUMPTION_URL ,WRITE_CONSUMPTION_DATA_URL, LOGIN_PAYLOAD)
while True:
    _, task_key = REDIS_CLIENT.brpop(WORKER_LIST_KEY)
    task_key = task_key.decode('utf-8')
    response_data = consumption_service.fetch_data()
    if response_data is None:
        continue

    

    for consumer_data in response_data:
        email = consumer_data.get('email')
        print(f"Processing data for {email}")
        power_supply_number = int(consumer_data.get('power_supply_number'))
        consumption_datetime = consumer_data.get('datetime')
        consumption_kwh = consumer_data.get('consumption_kwh')
        all_consumer_new_data = []

        if consumption_datetime is not None and consumption_kwh is not None:
            consumption_datetime = datetime.strptime(consumption_datetime, "%Y-%m-%dT%H:%M:%SZ")
            start_date = (consumption_datetime + timedelta(hours=1)).isoformat() + 'Z'
            end_date = datetime.now().replace(minute=0, second=0, microsecond=0).isoformat() + 'Z'
            
            first_9_digits_str = str(power_supply_number)[:9]
            first_9_digits = int(first_9_digits_str)
        else:
            start_date = (datetime.now() - timedelta(days=720)).replace(minute=0, second=0, microsecond=0).isoformat() + 'Z'
            end_date = datetime.now().replace(minute=0, second=0, microsecond=0).isoformat() + 'Z'

            first_9_digits_str = str(power_supply_number)[:9]
            first_9_digits = int(first_9_digits_str)


        new_consumption_data_df = get_kwh_for_date_range(start_date, end_date, first_9_digits)
        print("New consumption for the consumer:" + email + " is generated.")
        for index, row in new_consumption_data_df.iterrows():
            formatted_data = {
                "email": email,
                "datetime": row['datetime'].isoformat(),
                "consumption_kwh": row['kwh']
            }
            all_consumer_new_data.append(formatted_data)
        
        write_data_in_batches(all_consumer_new_data)
    
    




