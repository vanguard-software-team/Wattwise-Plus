from rest_framework import serializers
from .models import UserData
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom data to the token payload
        token['user_role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add additional custom data to the response

        return data
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        print("In UserSerializer class Meta!")
        model = UserData
        fields = ["id", "email", "name", "password", "role"]

    def create(self, validated_data):
        print("In UserSerializer create!")
        user = UserData.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            role=validated_data.get('role', 'consumer')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user