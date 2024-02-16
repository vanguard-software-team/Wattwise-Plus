from django.contrib.auth import authenticate
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import UpdateAPIView
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    ConsumerHourlyConsumptionSerializer,
    ConsumerDailyConsumptionSerializer,
    ConsumerWeeklyConsumptionSerializer,
    ConsumerMonthlyConsumptionSerializer,
    ConsumerHourlyConsumptionAggregateSerializer,
    ConsumerDailyConsumptionAggregateSerializer,
    ConsumerMonthlyConsumptionAggregateSerializer,
    ForecastingConsumerHourlyConsumptionSerializer,
    ForecastingConsumerDailyConsumptionSerializer,
    ForecastingConsumerWeeklyConsumptionSerializer,
    ConsumerInfoSerializer,
    ConsumerSerializer,
    PasswordChangeSerializer,
    ClusterSerializer,
    ClusterHourlyConsumptionSerializer,
    ClusterDailyConsumptionSerializer,
    ClusterWeeklyConsumptionSerializer,
    ClusterMonthlyConsumptionSerializer,
    ClusterHourlyConsumptionAggregateSerializer,
    ClusterDailyConsumptionAggregateSerializer,
    ClusterMonthlyConsumptionAggregateSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permissions import IsConsumerSelfOrProvider, IsConsumerSelf , IsProvider
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from datetime import datetime, timezone
from .models import (
    Consumer,
    ConsumerConsumption,
    ConsumerHourlyConsumptionAggregate,
    ConsumerDailyConsumptionAggregate,
    ConsumerMonthlyConsumptionAggregate,
    KwhPrice,
    ForecastingConsumerConsumption,
    Cluster,
    ClusterConsumption,
    ClusterHourlyConsumptionAggregate,
    ClusterDailyConsumptionAggregate,
    ClusterMonthlyConsumptionAggregate,
)
from dateutil import parser
from dateutil.parser import ParserError
from django.db.models import Sum
from django.db.models.functions import (
    TruncHour,
    TruncDay,
    TruncWeek,
    TruncMonth,
    ExtractMonth,
    ExtractYear,
)
from .globals import MEAN_PRICE_KWH_GREECE


def custom_refresh_token_payload(user):
    refresh = RefreshToken.for_user(user)
    refresh["user_type"] = user.user_type
    return refresh


# USER VIEWS

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
    

class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated, IsConsumerSelf)

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# CONSUMER CONSUMPTION RANGE VIEWS
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
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("hour", "month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("hour")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in hourly_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

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
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("day", "month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("day")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in daily_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

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
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("week", "month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("week")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in weekly_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

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
            .annotate(year=ExtractYear("datetime"))
            .values("month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("month")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in monthly_consumption:
            month = record["month"].month
            year = record["year"]
            price = prices_dict.get((month, year), MEAN_PRICE_KWH_GREECE)
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

        serializer = ConsumerMonthlyConsumptionSerializer(
            monthly_consumption, many=True
        )

        return Response(serializer.data)


# CONSUMER CONSUMPTION AGGREGATE VIEWS
class ConsumerConsumptionHourlyAggregateView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email):
        consumer = get_object_or_404(Consumer, user__email=email)
        aggregates = ConsumerHourlyConsumptionAggregate.objects.filter(
            consumer=consumer
        )
        
        serializer = ConsumerHourlyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)


class ConsumerConsumptionDailyAggregateView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email):
        consumer = get_object_or_404(Consumer, user__email=email)
        aggregates = ConsumerDailyConsumptionAggregate.objects.filter(consumer=consumer)
        serializer = ConsumerDailyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)


class ConsumerConsumptionMonthlyAggregateView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email):
        consumer = get_object_or_404(Consumer, user__email=email)
        aggregates = ConsumerMonthlyConsumptionAggregate.objects.filter(
            consumer=consumer
        )
        serializer = ConsumerMonthlyConsumptionAggregateSerializer(
            aggregates, many=True
        )
        return Response(serializer.data)

# CONSMUER CONSUMPTION FORECAST VIEWS
class ForecastingConsumerConsumptionHourlyInRangeView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email, start_date, end_date, format=None):
        print("test")
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

        forecasting_hourly_consumption = (
            ForecastingConsumerConsumption.timescale.filter(
                consumer=consumer, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(hour=TruncHour("datetime"))
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("hour", "month", "year")
            .annotate(forecasting_consumption_kwh=Sum("forecasting_consumption_kwh"))
            .order_by("hour")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in forecasting_hourly_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["forecasting_consumption_kwh"])

        serializer = ForecastingConsumerHourlyConsumptionSerializer(forecasting_hourly_consumption, many=True)

        return Response(serializer.data)

class ForecastingConsumerConsumptionDailyInRangeView(APIView):
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

        forecasting_daily_consumption = (
            ForecastingConsumerConsumption.timescale.filter(
                consumer=consumer, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(day=TruncDay("datetime"))
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("day", "month", "year")
            .annotate(forecasting_consumption_kwh=Sum("forecasting_consumption_kwh"))
            .order_by("day")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in forecasting_daily_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["forecasting_consumption_kwh"])

        serializer = ForecastingConsumerDailyConsumptionSerializer(forecasting_daily_consumption, many=True)

        return Response(serializer.data)

class ForecastingConsumerConsumptionWeeklyInRangeView(APIView):
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

        forecasting_weekly_consumption = (
            ForecastingConsumerConsumption.timescale.filter(
                consumer=consumer, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(week=TruncWeek("datetime"))
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("week", "month", "year")
            .annotate(forecasting_consumption_kwh=Sum("forecasting_consumption_kwh"))
            .order_by("week")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in forecasting_weekly_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["forecasting_consumption_kwh"])

        serializer = ForecastingConsumerWeeklyConsumptionSerializer(forecasting_weekly_consumption, many=True)

        return Response(serializer.data)

# CONSUMER PROFILE VIEWS

class ConsumerInfoView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, email, format=None):
        consumer = get_object_or_404(Consumer, user__email=email)
        self.check_object_permissions(self.request, consumer)
        serializer = ConsumerSerializer(consumer)
        return Response(serializer.data)

class ConsumerInfoUpdateView(UpdateAPIView):
    serializer_class = ConsumerInfoSerializer
    permission_classes = [IsAuthenticated, IsConsumerSelf]

    def get_object(self):
        consumer_email = self.kwargs.get('email')
        return get_object_or_404(Consumer, user__email=consumer_email)


# CLUSTER VIEWS

class ClusterInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id, format=None):
        cluster = get_object_or_404(Cluster, id=cluster_id)
        self.check_object_permissions(self.request, cluster)
        serializer = ClusterSerializer(cluster)
        return Response(serializer.data)

class ClusterConsumptionHourlyInRangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id, start_date, end_date, format=None):
        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        cluster = get_object_or_404(Cluster, id=cluster_id)
        self.check_object_permissions(self.request, cluster)

        hourly_consumption = (
            ClusterConsumption.timescale.filter(
                cluster=cluster, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(hour=TruncHour("datetime"))
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("hour", "month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("hour")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in hourly_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

        serializer = ClusterHourlyConsumptionSerializer(hourly_consumption, many=True)

        return Response(serializer.data)

class ClusterConsumptionDailyInRangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id, start_date, end_date, format=None):
        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        cluster = get_object_or_404(Cluster, id=cluster_id)
        self.check_object_permissions(self.request, cluster)

        daily_consumption = (
            ClusterConsumption.timescale.filter(
                cluster=cluster, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(day=TruncDay("datetime"))
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("day", "month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("day")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in daily_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

        serializer = ClusterDailyConsumptionSerializer(daily_consumption, many=True)

        return Response(serializer.data)

class ClusterConsumptionWeeklyInRangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id, start_date, end_date, format=None):
        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        cluster = get_object_or_404(Cluster, id=cluster_id)
        self.check_object_permissions(self.request, cluster)

        weekly_consumption = (
            ClusterConsumption.timescale.filter(
                cluster=cluster, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(week=TruncWeek("datetime"))
            .annotate(month=ExtractMonth("datetime"), year=ExtractYear("datetime"))
            .values("week", "month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("week")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in weekly_consumption:
            price = prices_dict.get(
                (record["month"], record["year"]), MEAN_PRICE_KWH_GREECE
            )
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

        serializer = ClusterWeeklyConsumptionSerializer(weekly_consumption, many=True)

        return Response(serializer.data)

class ClusterConsumptionMonthlyInRangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id, start_date, end_date, format=None):
        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ParserError:
            return Response(
                {"detail": "Invalid date format. Please use ISO 8601 format."},
                status=400,
            )

        cluster = get_object_or_404(Cluster, id=cluster_id)
        self.check_object_permissions(self.request, cluster)

        monthly_consumption = (
            ClusterConsumption.timescale.filter(
                cluster=cluster, datetime__range=(start_date_dt, end_date_dt)
            )
            .annotate(month=TruncMonth("datetime"))
            .annotate(year=ExtractYear("datetime"))
            .values("month", "year")
            .annotate(consumption_kwh=Sum("consumption_kwh"))
            .order_by("month")
        )

        kwh_prices = KwhPrice.objects.filter(
            year__gte=start_date_dt.year, year__lte=end_date_dt.year
        )
        prices_dict = {(price.month, price.year): price.price for price in kwh_prices}

        for record in monthly_consumption:
            month = record["month"].month
            year = record["year"]
            price = prices_dict.get((month, year), MEAN_PRICE_KWH_GREECE)
            record["cost_euro"] = float(price) * float(record["consumption_kwh"])

        serializer = ClusterMonthlyConsumptionSerializer(monthly_consumption, many=True)

        return Response(serializer.data)

# CLUSTER CONSUMPTION AGGREGATE VIEWS

class ClusterConsumptionHourlyAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id):
        cluster = get_object_or_404(Cluster, id=cluster_id)
        aggregates = ClusterHourlyConsumptionAggregate.objects.filter(
            cluster=cluster
        )
        
        serializer = ClusterHourlyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)

class ClusterConsumptionDailyAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id):
        cluster = get_object_or_404(Cluster, id=cluster_id)
        aggregates = ClusterDailyConsumptionAggregate.objects.filter(cluster=cluster)
        serializer = ClusterDailyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)

class ClusterConsumptionMonthlyAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cluster_id):
        cluster = get_object_or_404(Cluster, id=cluster_id)
        aggregates = ClusterMonthlyConsumptionAggregate.objects.filter(
            cluster=cluster
        )
        serializer = ClusterMonthlyConsumptionAggregateSerializer(
            aggregates, many=True
        )
        return Response(serializer.data)