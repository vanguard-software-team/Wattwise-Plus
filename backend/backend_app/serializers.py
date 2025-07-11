from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Consumer, Provider, SecretProviderKey
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from .models import (
    CustomUser,
    ConsumerConsumption,
    ConsumerHourlyConsumptionAggregate,
    ConsumerDailyConsumptionAggregate,
    ConsumerMonthlyConsumptionAggregate,
    Cluster,
    ClusterConsumption,
    ClusterHourlyConsumptionAggregate,
    ClusterDailyConsumptionAggregate,
    ClusterMonthlyConsumptionAggregate,
    KwhPrice,
    ForecastingConsumerConsumption,
    ForecastingMetrics
)
from .globals import MEAN_PRICE_KWH_GREECE


User = get_user_model()


# USER SERIALIZERS
class UserRegistrationSerializer(serializers.ModelSerializer):
    power_supply_number = serializers.CharField(required=False, allow_blank=True)
    secret_provider_key = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "user_type",
            "power_supply_number",
            "secret_provider_key",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def validate_power_supply_number(self, value):
        if value:  # Only validate if power_supply_number is provided
            regex_validator = RegexValidator(
                regex="^\d{11}$",
                message="Power supply number must be 11 digits",
                code="invalid_power_supply_number",
            )
            try:
                regex_validator(value)
            except ValidationError as e:
                raise serializers.ValidationError(e.messages)
        return value

    def validate(self, data):
        user_type = data.get("user_type")

        if user_type == "consumer":
            if not data.get("power_supply_number"):
                raise serializers.ValidationError(
                    {"power_supply_number": "This field is required for consumers."}
                )
        elif user_type == "provider":
            secret_key = data.get("secret_provider_key")
            if (
                not secret_key
                or not SecretProviderKey.objects.filter(
                    secret_provider_key=secret_key
                ).exists()
            ):
                raise serializers.ValidationError(
                    {
                        "secret_provider_key": "Invalid or missing secret key for provider."
                    }
                )
        else:
            raise serializers.ValidationError(
                {"user_type": "This field must be either 'consumer' or 'provider'."}
            )

        return data

    def create(self, validated_data):
        power_supply_number = validated_data.pop("power_supply_number", None)
        secret_provider_key = validated_data.pop("secret_provider_key", None)

        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            user_type=validated_data.get("user_type"),
        )

        if user.user_type == "consumer" and power_supply_number:
            Consumer.objects.create(user=user, power_supply_number=power_supply_number)
        elif user.user_type == "provider" and secret_provider_key:
            Provider.objects.create(user=user)

        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    retype_new_password = serializers.CharField(required=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, data):
        if data['new_password'] != data['retype_new_password']:
            raise serializers.ValidationError({"retype_new_password": "The two password fields didn't match."})
        password_validation.validate_password(data['new_password'], self.context['request'].user)
        return data


# CONSUMER SERIALIZERS

from rest_framework import serializers

class ConsumerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    power_supply_number = serializers.CharField(read_only=True)
    building_type = serializers.SerializerMethodField()
    square_meters = serializers.SerializerMethodField()
    floor = serializers.SerializerMethodField()
    building_built = serializers.SerializerMethodField()
    frames = serializers.SerializerMethodField()
    heating_type = serializers.SerializerMethodField()
    have_solar_panels = serializers.SerializerMethodField()
    hot_water = serializers.SerializerMethodField()
    ev_car_charger = serializers.SerializerMethodField()
    consumer_type = serializers.SerializerMethodField()
    full_name = serializers.CharField(source='get_full_name_display', read_only=True)  # Example if `full_name` had choices

    class Meta:
        model = Consumer
        exclude = ('id', 'user')

    def get_building_type(self, obj):
        return obj.get_building_type_display()

    def get_square_meters(self, obj):
        return obj.get_square_meters_display()

    def get_floor(self, obj):
        return obj.get_floor_display()

    def get_building_built(self, obj):
        return obj.get_building_built_display()

    def get_frames(self, obj):
        return obj.get_frames_display()

    def get_heating_type(self, obj):
        return obj.get_heating_type_display()

    def get_have_solar_panels(self, obj):
        return obj.get_have_solar_panels_display()

    def get_hot_water(self, obj):
        return obj.get_hot_water_display()

    def get_ev_car_charger(self, obj):
        return obj.get_ev_car_charger_display()

    def get_consumer_type(self, obj):
        return obj.get_consumer_type_display()

# Additional fields should be added similarly

        


class ConsumerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumer
        exclude = ('id','user','cluster')

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# CONSUMER CONSUMPTION SERIALIZERS
class ConsumerHourlyConsumptionSerializer(serializers.Serializer):
    hour = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


class ConsumerDailyConsumptionSerializer(serializers.Serializer):
    day = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


class ConsumerWeeklyConsumptionSerializer(serializers.Serializer):
    week = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


class ConsumerMonthlyConsumptionSerializer(serializers.Serializer):
    month = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


# CONSUMER AGGREGATE CONSUMPTION SERIALIZERS
class ConsumerHourlyConsumptionAggregateSerializer(serializers.ModelSerializer):
    hour = serializers.SerializerMethodField()
    cost_euro = serializers.SerializerMethodField() 

    def get_hour(self, obj):
        # ISO 8601 time format "HH:MM:SS"
        return f"{obj.hour:02d}:00:00"
    
    
    def get_cost_euro(self, obj):
        return float(obj.consumption_kwh_sum) * MEAN_PRICE_KWH_GREECE
    
    class Meta:
        model = ConsumerHourlyConsumptionAggregate
        fields = ("hour", "consumption_kwh_sum", "cost_euro")


class ConsumerDailyConsumptionAggregateSerializer(serializers.ModelSerializer):
    day = serializers.SerializerMethodField()
    cost_euro = serializers.SerializerMethodField()

    def get_day(self, obj):
        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        return days[obj.day - 1]
    
    def get_cost_euro(self, obj):
        return float(obj.consumption_kwh_sum) * MEAN_PRICE_KWH_GREECE

    class Meta:
        model = ConsumerDailyConsumptionAggregate
        fields = ("day", "consumption_kwh_sum", "cost_euro")


class ConsumerMonthlyConsumptionAggregateSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()
    cost_euro = serializers.SerializerMethodField()

    def get_month(self, obj):
        months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        return months[obj.month - 1]

    def get_cost_euro(self, obj):
        return float(obj.consumption_kwh_sum) * MEAN_PRICE_KWH_GREECE

    class Meta:
        model = ConsumerMonthlyConsumptionAggregate
        fields = ("month", "consumption_kwh_sum", "cost_euro")
        
# COSUMER FORECASTING SERIALIZERS
class ForecastingConsumerHourlyConsumptionSerializer(serializers.Serializer):
    hour = serializers.DateTimeField(required=True)
    forecasting_consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    forecasting_cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class ForecastingConsumerDailyConsumptionSerializer(serializers.Serializer):
    day = serializers.DateTimeField(required=True)
    forecasting_consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    forecasting_cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class ForecastingConsumerWeeklyConsumptionSerializer(serializers.Serializer):
    week = serializers.DateTimeField(required=True)
    forecasting_consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    forecasting_cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    

# CLUSTER SERIALIZERS

class ClusterSerializer(serializers.ModelSerializer):
    number_of_consumers = serializers.SerializerMethodField()
    class Meta:
        model = Cluster
        fields = '__all__'
    
    def get_number_of_consumers(self, obj):
        return obj.consumers.count()

class ClusterHourlyConsumptionSerializer(serializers.Serializer):
    hour = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class ClusterDailyConsumptionSerializer(serializers.Serializer):
    day = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    
class ClusterWeeklyConsumptionSerializer(serializers.Serializer):
    week = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class ClusterMonthlyConsumptionSerializer(serializers.Serializer):
    month = serializers.DateTimeField(required=True)
    consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class ClusterHourlyConsumptionAggregateSerializer(serializers.ModelSerializer):
    hour = serializers.SerializerMethodField()
    cost_euro = serializers.SerializerMethodField() 

    def get_hour(self, obj):
        # ISO 8601 time format "HH:MM:SS"
        return f"{obj.hour:02d}:00:00"
    
    def get_cost_euro(self, obj):
        return float(obj.consumption_kwh_sum) * MEAN_PRICE_KWH_GREECE
    
    class Meta:
        model = ClusterHourlyConsumptionAggregate
        fields = ("hour", "consumption_kwh_sum", "cost_euro")

class ClusterDailyConsumptionAggregateSerializer(serializers.ModelSerializer):
    day = serializers.SerializerMethodField()
    cost_euro = serializers.SerializerMethodField()

    def get_day(self, obj):
        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        return days[obj.day - 1]
    
    def get_cost_euro(self, obj):
        return float(obj.consumption_kwh_sum) * MEAN_PRICE_KWH_GREECE

    class Meta:
        model = ClusterDailyConsumptionAggregate
        fields = ("day", "consumption_kwh_sum", "cost_euro")

class ClusterMonthlyConsumptionAggregateSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()
    cost_euro = serializers.SerializerMethodField()

    def get_month(self, obj):
        months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        return months[obj.month - 1]

    def get_cost_euro(self, obj):
        return float(obj.consumption_kwh_sum) * MEAN_PRICE_KWH_GREECE

    class Meta:
        model = ClusterMonthlyConsumptionAggregate
        fields = ("month", "consumption_kwh_sum", "cost_euro")

# PROVIDER SERIALIZERS
class KwhPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = KwhPrice
        exclude = ('id',)


class ForecastingMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastingMetrics
        exclude = ('id',)

# OTHER
class OutliersInfoSerializer(serializers.Serializer):
    cluster_id = serializers.IntegerField()
    hour = serializers.CharField()
    email = serializers.EmailField()
    power_supply_number = serializers.CharField()
    consumer_type = serializers.CharField()
    consumption_kwh_sum = serializers.FloatField()
    deviation_percentage = serializers.FloatField()
    lower_bound = serializers.FloatField()
    upper_bound = serializers.FloatField()
    limit = serializers.FloatField()

# for demo purposes
class AddConsumerConsumptionSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = ConsumerConsumption
        fields = ['email', 'datetime', 'consumption_kwh']

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
            if not hasattr(user, 'consumer_profile'):
                raise serializers.ValidationError("There is no consumer associated with this email.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        except Exception as e:
            raise serializers.ValidationError(f"An unexpected error occurred: {str(e)}")
        return value

    def validate(self, attrs):
        datetime = attrs.get('datetime')
        consumption_kwh = attrs.get('consumption_kwh')
        return attrs

    def create(self, validated_data):
        email = validated_data.pop('email', None)
        if email is None:
            raise serializers.ValidationError({"email": "This field is required."})

        try:
            user = CustomUser.objects.get(email=email)
            consumer = user.consumer_profile
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        except Exception as e:
            raise serializers.ValidationError(f"An unexpected error occurred during user retrieval: {str(e)}")

        try:
            validated_data['consumer'] = consumer
            instance = super().create(validated_data)
            return instance
        except ValidationError as e:
            raise serializers.ValidationError(f"Model validation error: {e.messages}")
        except Exception as e:
            raise serializers.ValidationError(f"An unexpected error occurred during object creation: {str(e)}")

class AddConsumerForecastingSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = ForecastingConsumerConsumption
        fields = ['email', 'datetime', 'forecasting_consumption_kwh']

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
            if not hasattr(user, 'consumer_profile'):
                raise serializers.ValidationError("There is no consumer associated with this email.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        except Exception as e:
            raise serializers.ValidationError(f"An unexpected error occurred: {str(e)}")
        return value

    def validate(self, attrs):
        datetime = attrs.get('datetime')
        forecasting_consumption_kwh = attrs.get('forecasting_consumption_kwh')
        return attrs

    def create(self, validated_data):
        email = validated_data.pop('email', None)
        if email is None:
            raise serializers.ValidationError({"email": "This field is required."})

        try:
            user = CustomUser.objects.get(email=email)
            consumer = user.consumer_profile
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        except Exception as e:
            raise serializers.ValidationError(f"An unexpected error occurred during user retrieval: {str(e)}")

        try:
            validated_data['consumer'] = consumer
            instance = super().create(validated_data)
            return instance
        except ValidationError as e:
            raise serializers.ValidationError(f"Model validation error: {e.messages}")
        except Exception as e:
            raise serializers.ValidationError(f"An unexpected error occurred during object creation: {str(e)}")

class AddClusterConsumptionSerializer(serializers.ModelSerializer):
    cluster_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ClusterConsumption
        fields = ['cluster_id', 'datetime', 'consumption_kwh']

    def validate_cluster_id(self, value):
        try:
            Cluster.objects.get(id=value)
        except Cluster.DoesNotExist:
            raise serializers.ValidationError("Cluster with this ID does not exist.")
        return value

    def create(self, validated_data):
        cluster_id = validated_data.pop('cluster_id', None)
        if cluster_id is None:
            raise serializers.ValidationError({"cluster_id": "This field is required."})

        try:
            cluster = Cluster.objects.get(id=cluster_id)
            validated_data['cluster'] = cluster
            instance = super().create(validated_data)
            return instance
        except Exception as e:
            raise serializers.ValidationError(f"An unexpected error occurred: {str(e)}")