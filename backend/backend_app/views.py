from django.contrib.auth import authenticate
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    ConsumerHourlyConsumptionSerializer,
    ConsumerDailyConsumptionSerializer,
    ConsumerWeeklyConsumptionSerializer,
    ConsumerMonthlyConsumptionSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permissions import IsConsumerSelfOrProvider
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from datetime import datetime, timezone
from .models import Consumer, ConsumerConsumption, ConsumerHourlyConsumptionAggregate
from dateutil import parser
from dateutil.parser import ParserError
from django.db.models import Sum
from django.db.models.functions import TruncHour, TruncDay, TruncWeek, TruncMonth


def custom_refresh_token_payload(user):
    refresh = RefreshToken.for_user(user)
    refresh["user_type"] = user.user_type
    return refresh


class UserRegistrationView(views.APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = custom_refresh_token_payload(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(views.APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
            if user:
                refresh = custom_refresh_token_payload(user)
                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                )
            return Response(
                {"detail": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConsumerConsumptionHourlyInRangeView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email, start_date, end_date, format=None):

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        consumer = get_object_or_404(Consumer, user__email=email)

        self.check_object_permissions(self.request, consumer)

        hourly_consumption = (
            ConsumerConsumption.timescale.filter(
                consumer=consumer, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(hour=TruncHour("datetime"))
            .values("hour")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("hour")
        )

        serializer = ConsumerHourlyConsumptionSerializer(hourly_consumption, many=True)

        return Response(serializer.data)


class ConsumerConsumptionDailyInRangeView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email, start_date, end_date, format=None):
        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        consumer = get_object_or_404(Consumer, user__email=email)
        self.check_object_permissions(self.request, consumer)

        daily_consumption = (
            ConsumerConsumption.timescale.filter(
                consumer=consumer, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(day=TruncDay("datetime"))
            .values("day")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("day")
        )

        serializer = ConsumerDailyConsumptionSerializer(daily_consumption, many=True)

        return Response(serializer.data)


class ConsumerConsumptionWeeklyInRangeView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email, start_date, end_date, format=None):
        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        consumer = get_object_or_404(Consumer, user__email=email)
        self.check_object_permissions(self.request, consumer)

        weekly_consumption = (
            ConsumerConsumption.timescale.filter(
                consumer=consumer, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(week=TruncWeek("datetime"))
            .values("week")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("week")
        )

        serializer = ConsumerWeeklyConsumptionSerializer(weekly_consumption, many=True)

        return Response(serializer.data)


class ConsumerConsumptionMonthlyInRangeView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email, start_date, end_date, format=None):
        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        consumer = get_object_or_404(Consumer, user__email=email)
        self.check_object_permissions(request, consumer)

        monthly_consumption = (
            ConsumerConsumption.timescale.filter(
                consumer=consumer, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(month=TruncMonth("datetime"))
            .values("month")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("month")
        )

        serializer = ConsumerMonthlyConsumptionSerializer(
            monthly_consumption, many=True
        )

        return Response(serializer.data)


# TODO: Implement the ConsumerConsumptionAggregateHoursView
class ConsumerConsumptionAggregateHoursView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]
