from rest_framework import serializers
from .models import ConsumerConsumption, CustomUser

from rest_framework import serializers
from django.core.exceptions import ValidationError

class WorkerAddConsumerConsumptionSerializer(serializers.ModelSerializer):
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
        

class WorkerGetLastConsumptionSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='consumer.user.email')

    class Meta:
        model = ConsumerConsumption
        fields = ['email', 'datetime', 'consumption_kwh']



