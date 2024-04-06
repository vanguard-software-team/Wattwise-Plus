from django.core.management.base import BaseCommand
from backend_app.models import CustomUser, Consumer, SecretProviderKey, ConsumerHourlyConsumptionAggregate , ConsumerDailyConsumptionAggregate, ConsumerMonthlyConsumptionAggregate
import environ
from backend_app.demo_app.backend_service_data_fetch import DataFetchService
from backend_app.demo_app.data_generation import get_kwh_for_date_range, get_forecating_data_for_date_range
from datetime import timedelta
from datetime import datetime
from typing import List
import time
from dateutil.relativedelta import relativedelta

class Command(BaseCommand):
    help = "Initializes consumers for demo purposes."

    def write_data_in_batches(
        self, consumption_service: DataFetchService, data, batch_size=1000
    ):
        """
        Write data to the backend service in batches.
        """
        total_batches = len(data) // batch_size + (
            1 if len(data) % batch_size > 0 else 0
        )
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
                print(
                    f"Batch {i+1}/{total_batches} written successfully for {consumption_service.email}"
                )
            else:
                print(
                    f"Failed to write Batch {i+1}/{total_batches} after {attempt_count} attempts"
                )

    def handle(self, *args, **options):
        env = environ.Env()
        environ.Env.read_env()
        START_DEMO_INITIALIZATION = env("START_DEMO_INITIALIZATION", default="False")
        START_DEMO_INITIALIZATION = START_DEMO_INITIALIZATION == "True"
        print(f"START_DEMO_INITIALIZATION: {START_DEMO_INITIALIZATION}")
        if not START_DEMO_INITIALIZATION:
            self.stdout.write(self.style.ERROR("Demo initialization is disabled."))
            return

        # start demo initialization
        BACKEND_URL = "http://" + env("BACKEND_HOST") + ":" + env("BACKEND_PORT")
        LOGIN_BACKEND_URL = BACKEND_URL + "/login/"
        REGISTER_BACKEND_URL = BACKEND_URL + "/register/"
        TOKEN_REFRESH_URL = BACKEND_URL + "/token/refresh/"
        WRITE_CONSUMPTION_DATA_URL = BACKEND_URL + "/add/consumer/consumption"
        READ_CONSUMPTION_DATA_URL = BACKEND_URL + "/consumer/consumption/hourly"
        WRITE_FORECASTING_DATA_URL = BACKEND_URL + "/add/consumer/forecasting"
        CONSUMPTION_DATA_END_DATE = datetime(
            int(env("CONSUMPTION_DATA_END_YEAR", default=2024)),
            int(env("CONSUMPTION_DATA_END_MONTH", default=5)),
            int(env("CONSUMPTION_DATA_END_DAY", default=1)),
            0,
            0,
        )

        DAYS_BEFORE_END_DATE = int(
            env("CONSUMPTION_DATA_DAYS_BEFORE_ENDATE", default=365)
        )

        # create demo users
        email_list = env("DEMO_USERS_EMAILS", default="").split(",")
        password_list = env("DEMO_USERS_PASSWORDS", default="").split(",")
        user_type_list = env("DEMO_USERS_TYPES", default="").split(",")
        power_supply_number_list = env(
            "DEMO_USERS_POWER_SUPPLY_NUMBERS", default=""
        ).split(",")

        self.stdout.write("Attempting to create demo users.")
        if len(email_list) != len(password_list):
            self.stdout.write(
                self.style.ERROR("The number of emails and passwords do not match.")
            )
            return

        demo_consumer_services: List[DataFetchService] = []

        for email, password, user_type, power_supply_number in zip(
            email_list, password_list, user_type_list, power_supply_number_list
        ):
            LOGIN_REGISTER_PAYLOAD = {
                "email": email,
                "password": password,
                "user_type": user_type,
                "power_supply_number": power_supply_number,
            }
            service = DataFetchService(
                backend_url=BACKEND_URL,
                login_url=LOGIN_BACKEND_URL,
                register_url=REGISTER_BACKEND_URL,
                token_refresh_url=TOKEN_REFRESH_URL,
                login_register_payload=LOGIN_REGISTER_PAYLOAD,
                write_data_url=WRITE_CONSUMPTION_DATA_URL,
            )
            if service.register() == False:
                if service.login() == False:
                    service.update_access_token()

            if service.access_token and service.refresh_token:
                demo_consumer_services.append(service)
                continue
            else:
                self.stdout.write(
                    self.style.ERROR(f"Failed to create/login user with email: {email}")
                )
                return

        self.stdout.write("Users created successfully.")

        # create demo provider
        self.stdout.write("Attempting to create demo provider.")
        provider_email = env("DEMO_PROVIDER_EMAIL", default="")
        provider_password = env("DEMO_PROVIDER_PASSWORD", default="")
        provider_user_type = env("DEMO_PROVIDER_TYPE", default="")
        provider_secret_key = env("DEMO_PROVIDER_SECRET_KEY", default="")
        SecretProviderKey.objects.get_or_create(secret_provider_key=provider_secret_key)
        LOGIN_REGISTER_PAYLOAD_PROVIDER = {
            "email": provider_email,
            "password": provider_password,
            "user_type": provider_user_type,
            "secret_provider_key": provider_secret_key,
        }
        provider_service = DataFetchService(
            backend_url=BACKEND_URL,
            login_url=LOGIN_BACKEND_URL,
            register_url=REGISTER_BACKEND_URL,
            token_refresh_url=TOKEN_REFRESH_URL,
            login_register_payload=LOGIN_REGISTER_PAYLOAD_PROVIDER,
        )
        if provider_service.register() == False:
            if provider_service.login() == False:
                provider_service.update_access_token()

        if not provider_service.access_token or not provider_service.refresh_token:
            self.stdout.write(
                self.style.ERROR(
                    f"Failed to create/login provider with email: {provider_email}"
                )
            )
            return
        self.stdout.write("Provider created successfully.")

        # create demo superuser
        self.stdout.write("Attempting to create superuser.")
        superuser_email = env("DEMO_SUPERUSER_EMAIL", default="")
        superuser_password = env("DEMO_SUPERUSER_PASSWORD", default="")

        if not CustomUser.objects.filter(
            email=superuser_email, is_superuser=True
        ).exists():
            CustomUser.objects.create_superuser(
                email=superuser_email, password=superuser_password
            )
            print(f"Superuser with the email {superuser_email} created successfully.")
        else:
            print(f"A superuser with the email {superuser_email} already exists.")

        #  populate consumer consumption data
        for service in demo_consumer_services:
            all_consumer_data = []
            start_date = (
                CONSUMPTION_DATA_END_DATE - timedelta(days=DAYS_BEFORE_END_DATE)
            ).replace(minute=0, second=0, microsecond=0).isoformat() + "Z"
            end_date = (
                CONSUMPTION_DATA_END_DATE.replace(
                    minute=0, second=0, microsecond=0
                ).isoformat()
                + "Z"
            )
            first_9_digits_str = str(service.power_supply_number)[:9]
            first_9_digits = int(first_9_digits_str)
            new_consumption_data_df = get_kwh_for_date_range(
                start_date, end_date, first_9_digits
            )
            for index, row in new_consumption_data_df.iterrows():
                formatted_data = {
                    "email": service.email,
                    "datetime": row["datetime"].isoformat(),
                    "consumption_kwh": row["kwh"],
                }
                all_consumer_data.append(formatted_data)

            self.write_data_in_batches(service, all_consumer_data, 1000)
        

        # populate consumer aggregation data
        print("Populating consumer aggregation data")
        start_date = (
            CONSUMPTION_DATA_END_DATE - timedelta(days=DAYS_BEFORE_END_DATE)
        ).replace(minute=0, second=0, microsecond=0)
        end_date = (
            CONSUMPTION_DATA_END_DATE.replace(
                minute=0, second=0, microsecond=0
            )
        )
        total_duration = end_date - start_date
        range_duration = total_duration / 10
        date_ranges = [(start_date + range_duration * i, start_date + range_duration * (i + 1)) for i in range(10)]

        for service in demo_consumer_services:
            service.read_data_url = READ_CONSUMPTION_DATA_URL
            print(f"Fetching data for {service.email}")
            all_consumer_data = []
            for start_date, end_date in date_ranges:
                formatted_data = {
                    "email": service.email,
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                }
                response = service.fetch_data(formatted_data)
                if response:
                    all_consumer_data.extend(response)
                else:
                    print(f"Failed to read data for {service.email}")
                    return
            print(f"Data fetched for {service.email} the size is {len(all_consumer_data)}")

            consumption_by_hour = {i: 0 for i in range(24)}
            consumption_by_day = {i: 0 for i in range(1, 8)}
            consumption_by_month = {i: 0 for i in range(1, 13)}
            for record in all_consumer_data:
                hour = datetime.fromisoformat(record["hour"]).hour
                day = datetime.fromisoformat(record["hour"]).weekday() + 1
                month = datetime.fromisoformat(record["hour"]).month
                consumption_kwh = float(record["consumption_kwh"]) 
                consumption_by_hour[hour] += consumption_kwh
                consumption_by_day[day] += consumption_kwh
                consumption_by_month[month] += consumption_kwh

            consumer = Consumer.objects.get(user__email=service.email)

            for hour, total_consumption in consumption_by_hour.items():
                aggregate, created = ConsumerHourlyConsumptionAggregate.objects.update_or_create(
                    consumer=consumer,
                    hour=hour,
                    consumption_kwh_sum=total_consumption
                )
            
            for day, total_consumption in consumption_by_day.items():
                aggregate, created = ConsumerDailyConsumptionAggregate.objects.update_or_create(
                    consumer=consumer,
                    day=day,
                    consumption_kwh_sum=total_consumption
                )
            
            for month, total_consumption in consumption_by_month.items():
                aggregate, created = ConsumerMonthlyConsumptionAggregate.objects.update_or_create(
                    consumer=consumer,
                    month=month,
                    consumption_kwh_sum=total_consumption
                )

            print("Aggregation complete for ", service.email)
        
        # populate forecasting data
        print("Populating forecasting data")
        start_date = (
            CONSUMPTION_DATA_END_DATE - timedelta(days=DAYS_BEFORE_END_DATE)
        ).replace(minute=0, second=0, microsecond=0).isoformat() + "Z"
        end_date = CONSUMPTION_DATA_END_DATE + relativedelta(months=1)
        end_date = end_date.replace(minute=0, second=0, microsecond=0)
        end_date = end_date.isoformat() + "Z"
        for service in demo_consumer_services:
            all_consumer_data = []
            service.write_data_url = WRITE_FORECASTING_DATA_URL
            first_9_digits_str = str(service.power_supply_number)[:9]
            first_9_digits = int(first_9_digits_str)
            forecasting_data_df = get_forecating_data_for_date_range(
                start_date, end_date, first_9_digits
            )
            for index, row in forecasting_data_df.iterrows():
                formatted_data = {
                    "email": service.email,
                    "datetime": row["datetime"].isoformat(),
                    "forecasting_consumption_kwh": row["forecasted_kwh"],
                }
                all_consumer_data.append(formatted_data)

            self.write_data_in_batches(service, all_consumer_data, 1000)
            print(f"Forecasting data populated for {service.email}")
        print("Forecasting data populated successfully")


            
        
