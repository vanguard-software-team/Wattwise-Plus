from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Consumer, Provider, SecretProviderKey
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from .models import (
    ConsumerConsumption,
    ConsumerHourlyConsumptionAggregate,
    ConsumerDailyConsumptionAggregate,
    ConsumerMonthlyConsumptionAggregate,
    Cluster,
    ClusterConsumption,
    ClusterHourlyConsumptionAggregate,
    ClusterDailyConsumptionAggregate,
    ClusterMonthlyConsumptionAggregate,
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

class ConsumerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    class Meta:
        model = Consumer
        exclude = ('id','user')
        


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
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class ForecastingConsumerDailyConsumptionSerializer(serializers.Serializer):
    day = serializers.DateTimeField(required=True)
    forecasting_consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class ForecastingConsumerWeeklyConsumptionSerializer(serializers.Serializer):
    week = serializers.DateTimeField(required=True)
    forecasting_consumption_kwh = serializers.DecimalField(max_digits=10, decimal_places=3)
    cost_euro = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    

# CLUSTER SERIALIZERS

class ClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cluster
        fields = '__all__'

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