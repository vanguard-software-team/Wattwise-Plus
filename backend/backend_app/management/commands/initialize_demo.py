"""
This script initializes the demo data for the backend service.
It creates demo users, populates their consumption data, and assigns them to clusters.
It also creates a demo provider and a superuser.
The script also populates the Kwh prices and forecasting metrics data.
The script is triggered by the `initialize_demo` management command.
"""

from django.core.management.base import BaseCommand
from backend_app.models import (
    CustomUser,
    Consumer,
    KwhPrice,
    ForecastingMetrics,
    Cluster,
    ClusterHourlyConsumptionAggregate,
    ClusterDailyConsumptionAggregate,
    ClusterMonthlyConsumptionAggregate,
    ClusterConsumption,
    SecretProviderKey,
    ConsumerHourlyConsumptionAggregate,
    ConsumerDailyConsumptionAggregate,
    ConsumerMonthlyConsumptionAggregate,
)
import environ
from backend_app.demo_app.backend_service_data_fetch import DataFetchService
from backend_app.demo_app.data_generation import (
    get_kwh_for_date_range,
    get_forecating_data_for_date_range,
)
from datetime import timedelta
from datetime import datetime
from typing import List
import random
from dateutil.relativedelta import relativedelta
import pandas as pd
from django.db.models import Avg
from backend_app.globals import (
    BUILDING_TYPE_CHOICES,
    SQUARE_METERS_CHOICES,
    FLOOR_CHOICES,
    HOUSE_BUILT_CHOICES,
    FRAME_CHOICES,
    HEATING_TYPE_CHOICES,
    SOLAR_PANELS_CHOICES,
    HOT_WATER_METHOD_CHOICES,
    EV_CAR_CHARGER_CHOICES,
    NUMBER_OF_OCCUPANTS,
    TYPE_OF_OCCUPANTS,
    AGE_OF_ELECTRICITY_MANAGER,
    EMPLOYEE_NUMBER_CHOICES,
    CLUSTERS,
    KWH_PRICES,
)


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

    def random_choice_from_tuples(self, choice_list):
        return random.choice(choice_list)[0]

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
        READ_CONSUMPTION_CLUSTER_DATA_URL = BACKEND_URL + "/cluster/consumption/hourly"
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
            if service.register() is False:
                if service.login() is False:
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

        # populate consumer data
        print("Populating consumer info data")
        for service in demo_consumer_services:
            try:
                consumer = Consumer.objects.get(user__email=service.email)
            except Consumer.DoesNotExist:
                continue

            consumer_type = "individual"
            consumer.building_type = self.random_choice_from_tuples(
                BUILDING_TYPE_CHOICES
            )
            consumer.square_meters = self.random_choice_from_tuples(
                SQUARE_METERS_CHOICES
            )
            consumer.floor = self.random_choice_from_tuples(FLOOR_CHOICES)
            consumer.building_built = self.random_choice_from_tuples(
                HOUSE_BUILT_CHOICES
            )
            consumer.frames = self.random_choice_from_tuples(FRAME_CHOICES)
            consumer.heating_type = self.random_choice_from_tuples(HEATING_TYPE_CHOICES)
            consumer.have_solar_panels = self.random_choice_from_tuples(
                SOLAR_PANELS_CHOICES
            )
            consumer.hot_water = self.random_choice_from_tuples(
                HOT_WATER_METHOD_CHOICES
            )
            consumer.ev_car_charger = self.random_choice_from_tuples(
                EV_CAR_CHARGER_CHOICES
            )

            if consumer_type == "individual":
                consumer.consumer_type = "individual"
                consumer.number_of_occupants = self.random_choice_from_tuples(
                    NUMBER_OF_OCCUPANTS
                )
                consumer.type_of_occupants = self.random_choice_from_tuples(
                    TYPE_OF_OCCUPANTS
                )
                consumer.age_electricity_manager = self.random_choice_from_tuples(
                    AGE_OF_ELECTRICITY_MANAGER
                )
            else:
                consumer.consumer_type = "company"
                consumer.number_of_employees = self.random_choice_from_tuples(
                    EMPLOYEE_NUMBER_CHOICES
                )

            consumer.save()
            print(f"Consumer info data populated for {service.email}")
        print("Consumer info data populated successfully")

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
        if provider_service.register() is False:
            if provider_service.login() is False:
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
        end_date = CONSUMPTION_DATA_END_DATE.replace(minute=0, second=0, microsecond=0)
        total_duration = end_date - start_date
        range_duration = total_duration / 10
        date_ranges = [
            (start_date + range_duration * i, start_date + range_duration * (i + 1))
            for i in range(10)
        ]

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
            print(
                f"Data fetched for {service.email} the size is {len(all_consumer_data)}"
            )

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
                aggregate, created = (
                    ConsumerHourlyConsumptionAggregate.objects.update_or_create(
                        consumer=consumer,
                        hour=hour,
                        consumption_kwh_sum=total_consumption,
                    )
                )

            for day, total_consumption in consumption_by_day.items():
                aggregate, created = (
                    ConsumerDailyConsumptionAggregate.objects.update_or_create(
                        consumer=consumer,
                        day=day,
                        consumption_kwh_sum=total_consumption,
                    )
                )

            for month, total_consumption in consumption_by_month.items():
                aggregate, created = (
                    ConsumerMonthlyConsumptionAggregate.objects.update_or_create(
                        consumer=consumer,
                        month=month,
                        consumption_kwh_sum=total_consumption,
                    )
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

        # cluster consumers
        for cluster in CLUSTERS:
            Cluster.objects.get_or_create(
                name=cluster["name"],
                cluster_type=cluster["cluster_type"],
                description=cluster["description"],
            )

        print("Assign consumers to clusters")
        cluster_counts = {cluster["name"]: 0 for cluster in CLUSTERS}
        cluster_objects = {
            cluster["name"]: Cluster.objects.get(name=cluster["name"])
            for cluster in CLUSTERS
        }

        all_consumers_info = Consumer.objects.filter(consumer_type="individual")
        for consumer in all_consumers_info:
            if consumer.cluster:
                print(
                    f"Consumer {consumer.user.email} already assigned to cluster {consumer.cluster.name}"
                )
                continue
            min_cluster_name = min(cluster_counts, key=cluster_counts.get)

            consumer.cluster = cluster_objects[min_cluster_name]
            consumer.save()

            cluster_counts[min_cluster_name] += 1

            print(
                f"Consumer {consumer.user.email} assigned to cluster {min_cluster_name}"
            )
        print("Consumers assigned to clusters successfully")

        # popluate cluster consumption data
        clusters = Cluster.objects.all()
        start_date = (
            CONSUMPTION_DATA_END_DATE - timedelta(days=DAYS_BEFORE_END_DATE)
        ).replace(minute=0, second=0, microsecond=0)
        end_date = CONSUMPTION_DATA_END_DATE.replace(minute=0, second=0, microsecond=0)
        total_duration = end_date - start_date
        range_duration = total_duration / 10
        date_ranges = [
            (start_date + range_duration * i, start_date + range_duration * (i + 1))
            for i in range(10)
        ]
        all_cluster_data = []
        for cluster in clusters:
            all_consumer_data_in_cluster = []
            for service in demo_consumer_services:
                if service.email not in [
                    consumer.user.email for consumer in cluster.consumers.all()
                ]:
                    continue
                service.read_data_url = READ_CONSUMPTION_DATA_URL
                print(f"Fetching data for {service.email}")
                for start_date, end_date in date_ranges:
                    formatted_data = {
                        "email": service.email,
                        "start_date": start_date.isoformat(),
                        "end_date": end_date.isoformat(),
                    }
                    response = service.fetch_data(formatted_data)
                    if response:
                        all_consumer_data_in_cluster.extend(response)
                    else:
                        print(f"Failed to read data for {service.email}")
                        return
            print(
                f"Data fetched for {service.email} the size of all users data in cluster {cluster} is now {len(all_consumer_data_in_cluster)}"
            )
            df = pd.DataFrame(all_consumer_data_in_cluster)
            df["consumption_kwh"] = pd.to_numeric(df["consumption_kwh"])
            result = df.groupby("hour")["consumption_kwh"].mean().reset_index()
            for index, row in result.iterrows():
                formatted_data = {
                    "cluster": cluster,
                    "datetime": row["hour"],
                    "consumption_kwh": row["consumption_kwh"],
                }
                cluster_consumption_instance = ClusterConsumption(**formatted_data)
                cluster_consumption_instance.save()
            # also add add a key value pair for the cluster name
            all_cluster_data.extend(all_consumer_data_in_cluster)
            all_cluster_data.append({"cluster": cluster})
        print("Cluster consumption data populated successfully")

        # populate cluster aggregation data
        print("Populating cluster aggregation data")
        clusters = Cluster.objects.all()
        start_date = (
            CONSUMPTION_DATA_END_DATE - timedelta(days=DAYS_BEFORE_END_DATE)
        ).replace(minute=0, second=0, microsecond=0)
        end_date = CONSUMPTION_DATA_END_DATE.replace(minute=0, second=0, microsecond=0)
        total_duration = end_date - start_date
        range_duration = total_duration / 10
        date_ranges = [
            (start_date + range_duration * i, start_date + range_duration * (i + 1))
            for i in range(10)
        ]
        service = demo_consumer_services[0]
        service.read_data_url = READ_CONSUMPTION_CLUSTER_DATA_URL
        for cluster in clusters:
            print(f"Fetching data for cluster {cluster.name}")
            cluster_data = []
            for start_date, end_date in date_ranges:
                formatted_data = {
                    "cluster_id": cluster.id,
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                }
                response = service.fetch_data(formatted_data)
                if response:
                    cluster_data.extend(response)
                else:
                    print(f"Failed to read data for {cluster.name}")
                    return
            print(f"Data fetched for {cluster.name} the size is {len(cluster_data)}")

            consumption_by_hour = {i: 0 for i in range(24)}
            consumption_by_day = {i: 0 for i in range(1, 8)}
            consumption_by_month = {i: 0 for i in range(1, 13)}
            for record in cluster_data:
                hour = datetime.fromisoformat(record["hour"]).hour
                day = datetime.fromisoformat(record["hour"]).weekday() + 1
                month = datetime.fromisoformat(record["hour"]).month
                consumption_kwh = float(record["consumption_kwh"])
                consumption_by_hour[hour] += consumption_kwh
                consumption_by_day[day] += consumption_kwh
                consumption_by_month[month] += consumption_kwh

            for hour, total_consumption in consumption_by_hour.items():
                aggregate, created = (
                    ClusterHourlyConsumptionAggregate.objects.update_or_create(
                        cluster=cluster,
                        hour=hour,
                        consumption_kwh_sum=total_consumption,
                    )
                )

            for day, total_consumption in consumption_by_day.items():
                aggregate, created = (
                    ClusterDailyConsumptionAggregate.objects.update_or_create(
                        cluster=cluster, day=day, consumption_kwh_sum=total_consumption
                    )
                )

            for month, total_consumption in consumption_by_month.items():
                aggregate, created = (
                    ClusterMonthlyConsumptionAggregate.objects.update_or_create(
                        cluster=cluster,
                        month=month,
                        consumption_kwh_sum=total_consumption,
                    )
                )

            print("Aggregation complete for ", cluster.name)
        print("Cluster aggregation data populated successfully")

        # populate Kwh prices data
        print("Populating Kwh prices data")
        for kwh_price in KWH_PRICES:
            KwhPrice.objects.get_or_create(
                price=kwh_price["price"],
                month=kwh_price["month"],
                year=kwh_price["year"],
            )
        print("Kwh prices data populated successfully")

        # populate forecasting metrics data
        print("Populating forecasting metrics data")
        ForecastingMetrics.objects.get_or_create(
            mape=0.132,
            rmse=0.25,
            mse=2.5,
        )
        print("Forecasting metrics data populated successfully")
        self.stdout.write(self.style.SUCCESS("Demo data initialized successfully."))
