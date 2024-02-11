from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Consumer, Provider, SecretProviderKey
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    power_supply_number = serializers.CharField(required=False, allow_blank=True)
    secret_provider_key = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'user_type', 'power_supply_number', 'secret_provider_key')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_power_supply_number(self, value):
        if value:  # Only validate if power_supply_number is provided
            regex_validator = RegexValidator(
                regex='^\d{11}$',
                message='Power supply number must be 11 digits',
                code='invalid_power_supply_number'
            )
            try:
                regex_validator(value)
            except ValidationError as e:
                raise serializers.ValidationError(e.messages)
        return value

    def validate(self, data):
        user_type = data.get('user_type')

        if user_type == 'consumer':
            if not data.get('power_supply_number'):
                raise serializers.ValidationError({"power_supply_number": "This field is required for consumers."})
        elif user_type == 'provider':
            secret_key = data.get('secret_provider_key')
            if not secret_key or not SecretProviderKey.objects.filter(secret_provider_key=secret_key).exists():
                raise serializers.ValidationError({"secret_provider_key": "Invalid or missing secret key for provider."})
        else:
            raise serializers.ValidationError({"user_type": "This field must be either 'consumer' or 'provider'."})

        return data

    def create(self, validated_data):
        power_supply_number = validated_data.pop('power_supply_number', None)
        secret_provider_key = validated_data.pop('secret_provider_key', None)

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data.get('user_type')
        )

        if user.user_type == 'consumer' and power_supply_number:
            Consumer.objects.create(user=user, power_supply_number=power_supply_number)
        elif user.user_type == 'provider' and secret_provider_key:
            Provider.objects.create(user=user)

        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
