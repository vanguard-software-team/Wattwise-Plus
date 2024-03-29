import requests
import time


class DataFetchService:
    def __init__(self, backend_url = "", login_url = "", register_url = "", token_refresh_url = "", read_data_url = "", write_data_url = "", login_register_payload = ""):
        self.backend_url = backend_url
        self.login_url = login_url
        self.register_url = register_url
        self.token_refresh_url = token_refresh_url
        self.email = login_register_payload.get('email')
        self.password = login_register_payload.get('password')
        self.user_type = login_register_payload.get('user_type',None)
        self.power_supply_number = login_register_payload.get('power_supply_number',None)
        self.secret_provider_key = login_register_payload.get('secret_provider_key',None)
        self.access_token = None
        self.refresh_token = None
        self.read_data_url = read_data_url
        self.write_data_url = write_data_url
    
    def register(self):
        if self.power_supply_number is None:
            register_payload = {
                'email': self.email, 
                'password': self.password, 
                'user_type': self.user_type, 
                'secret_provider_key': self.secret_provider_key
            }
        else:
            register_payload = {
                'email': self.email, 
                'password': self.password, 
                'user_type': self.user_type, 
                'power_supply_number': self.power_supply_number
            }
        try:
            response = requests.post(self.register_url, data=register_payload)
            if response.status_code == 201:
                tokens = response.json()
                self.access_token = tokens.get('access')
                self.refresh_token = tokens.get('refresh')
                return True
            else:
                print("Registration failed with status code: ", response.status_code)
                return False
        except Exception as e:
            print(f"Error during registration: {e}")
            return False


    def login(self):
        login_payload = {'email': self.email, 'password': self.password}
        while True:
            try:
                response = requests.post(self.login_url, json=login_payload)
                if response.status_code == 200:
                    tokens = response.json()
                    self.access_token = tokens.get('access')
                    self.refresh_token = tokens.get('refresh')
                    return True
                else:
                    print(f"Login failed, Status Code: {response.status_code}")
                    time.sleep(1)
            except Exception as e:
                print(f"Error during login: {e}")
                time.sleep(1)

    def update_access_token(self):
        refresh_payload = {'refresh': self.refresh_token}
        try:
            response = requests.post(self.token_refresh_url, json=refresh_payload)
            if response.status_code == 200:
                tokens = response.json()
                self.access_token = tokens.get('access')
                self.refresh_token = tokens.get('refresh', self.refresh_token)
                return True
            else:
                print(f"Failed to update access token, Status Code: {response.status_code}")
                if response.status_code in [401, 403]:
                    self.login()
                    return self.update_access_token()
                return False
        except Exception as e:
            print(f"Error during access token update: {e}")
            return False
        
    
    def fetch_data(self):
        headers = {'Authorization': f'Bearer {self.access_token}'}

        try:
            response = requests.get(self.read_data_url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                print(f"Failed to fetch data, Status Code: {response.status_code}")
                if response.status_code == 401:
                    self.update_access_token()
                    return self.fetch_data()
                return None
        except Exception as e:
            print(f"Error during data fetch: {e}")
            return None
    
    def write_data(self, data):
        headers = {'Authorization': f'Bearer {self.access_token}'}
        try:
            response = requests.post(self.write_data_url, json=data, headers=headers)
            if response.status_code == 201:
                return True
            else:
                print(f"Failed to write data, Status Code: {response.status_code}")
                if response.status_code == 401:
                    self.update_access_token()
                    return self.write_data(data)
                return False
        except Exception as e:
            print(f"Error during data write: {e}")
            return False


    def get_access_token(self):
        return self.access_token

    def get_refresh_token(self):
        return self.refresh_token