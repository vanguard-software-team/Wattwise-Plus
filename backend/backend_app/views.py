from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import (
TokenObtainPairView,
TokenRefreshView,
)
from .serializers import CustomTokenObtainPairSerializer

def index(request):
    return HttpResponse("Hello, world from backend!")


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView.as_view()
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                user = serializer.save()
        except ValueError as e:
            content = {"Value Error": str(e)}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class YourProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Access the payload data from the JWT in the request.user object
        print("test")
        print(request.user.email)
        print(request.user.role)
        print(type(request.user))

        return Response({"message": f"Custom data from JWT: {request}"})