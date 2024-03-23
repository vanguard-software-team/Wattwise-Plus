import redis
import time
import os
import requests

REDIS_HOST = os.environ.get('REDIS_HOST')
REDIS_PORT = int(os.environ.get('REDIS_PORT'))
REDIS_CLIENT = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
WORKER_NAME = os.environ.get('CONSUMPTION_WORKER_NAME', "consumption_worker")
BACKEND_URL = "http://backend:" + os.environ.get('BACKEND_PORT')
LOGIN_BACKEND_URL = BACKEND_URL + "/login/"
LAST_CONSUMPTION_URL = BACKEND_URL + "/worker/get/consumers/last/consumption"
LOGIN_PAYLOAD = {
    'email': os.environ.get('WATTWISE_WORKER_EMAIL'),
    'password': os.environ.get('WATTWISE_WORKER_PASSWORD')
}
WORKER_LIST_KEY = f"list_{WORKER_NAME}"

class AuthorizationManager:
    def __init__(self, backend_url, login_url, login_payload):
        self.backend_url = backend_url
        self.login_url = login_url
        self.email = login_payload.get('email')
        self.password = login_payload.get('password')
        self.access_token = None
        self.refresh_token = None
        self.login()

    def login(self):
        login_payload = {'email': self.email, 'password': self.password}
        while True:
            try:
                response = requests.post(self.login_url, json=login_payload)
                if response.status_code == 200:
                    tokens = response.json()
                    self.access_token = tokens.get('access')
                    self.refresh_token = tokens.get('refresh')
                    print("Login successful")
                    return True
                else:
                    print(f"Login failed, Status Code: {response.status_code}")
                    time.sleep(10)
            except Exception as e:
                time.sleep(10)


    def get_access_token(self):
        return self.access_token

    def get_refresh_token(self):
        return self.refresh_token


class ConsumptionDataFetcher:
    def __init__(self, consumption_data_url, access_token):
        self.consumption_data_url = consumption_data_url
        self.access_token = access_token

    def fetch_data(self):
        headers = {'Authorization': f'Bearer {self.access_token}'}
        print("Access token is: ", self.access_token)
        print("headers are: ", headers)

        try:
            print("last consumption url is: ", self.consumption_data_url)
            response = requests.get(self.consumption_data_url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                print(f"Failed to fetch data, Status Code: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error during data fetch: {e}")
            return None

login_manager = AuthorizationManager(BACKEND_URL, LOGIN_BACKEND_URL, LOGIN_PAYLOAD)
data_fetcher = ConsumptionDataFetcher(LAST_CONSUMPTION_URL, login_manager.get_access_token())
while True:
    _, task_key = REDIS_CLIENT.brpop(WORKER_LIST_KEY)
    task_key = task_key.decode('utf-8')
    print(data_fetcher.fetch_data())




