from django.contrib.auth import authenticate
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import UpdateAPIView
from django.shortcuts import get_list_or_404
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
    ClusterMonthlyConsumptionAggregateSerializer,
    KwhPriceSerializer,
    ForecastingMetricsSerializer,
    OutliersInfoSerializer,
    AddConsumerConsumptionSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permissions import IsConsumerSelfOrProvider, IsConsumerSelf , IsProvider , IsSelfUser
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from datetime import datetime, timezone
from .models import (
    CustomUser,
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
    ForecastingMetrics,
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
import numpy



def custom_refresh_token_payload(user):
    refresh = RefreshToken.for_user(user)
    refresh["user_type"] = user.user_type
    refresh["email"] = user.email
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
    permission_classes = (IsAuthenticated,IsSelfUser)

    def post(self, request):
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

    def get(self, request, format=None):
        email = request.query_params.get('email')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not email or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: email, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request, format=None):
        email = request.query_params.get('email')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not email or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: email, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request, format=None):
        email = request.query_params.get('email')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not email or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: email, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request, format=None):
        email = request.query_params.get('email')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not email or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: email, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {"detail": "Missing required parameters: email."},
                status=400,
            )
        consumer = get_object_or_404(Consumer, user__email=email)
        aggregates = ConsumerHourlyConsumptionAggregate.objects.filter(
            consumer=consumer
        )
        
        serializer = ConsumerHourlyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)


class ConsumerConsumptionDailyAggregateView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {"detail": "Missing required parameters: email."},
                status=400,
            )
        consumer = get_object_or_404(Consumer, user__email=email)
        aggregates = ConsumerDailyConsumptionAggregate.objects.filter(consumer=consumer)
        serializer = ConsumerDailyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)


class ConsumerConsumptionMonthlyAggregateView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {"detail": "Missing required parameters: email."},
                status=400,
            )
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

    def get(self, request, format=None):
        email = request.query_params.get('email')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not email or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: email, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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
            record["forecasting_cost_euro"] = float(price) * float(record["forecasting_consumption_kwh"])

        serializer = ForecastingConsumerHourlyConsumptionSerializer(forecasting_hourly_consumption, many=True)

        return Response(serializer.data)

class ForecastingConsumerConsumptionDailyInRangeView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, format=None):
        email = request.query_params.get('email')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not email or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: email, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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
            record["forecasting_cost_euro"] = float(price) * float(record["forecasting_consumption_kwh"])

        serializer = ForecastingConsumerDailyConsumptionSerializer(forecasting_daily_consumption, many=True)

        return Response(serializer.data)

class ForecastingConsumerConsumptionWeeklyInRangeView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, format=None):
        email = request.query_params.get('email')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not email or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: email, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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
            record["forecasting_cost_euro"] = float(price) * float(record["forecasting_consumption_kwh"])

        serializer = ForecastingConsumerWeeklyConsumptionSerializer(forecasting_weekly_consumption, many=True)

        return Response(serializer.data)

# CONSUMER PROFILE VIEWS

class ConsumerInfoView(APIView):
    permission_classes = [IsAuthenticated, IsConsumerSelfOrProvider]

    def get(self, request, format=None):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {"detail": "Missing required parameters: email."},
                status=400,
            )
        consumer = get_object_or_404(Consumer, user__email=email)
        self.check_object_permissions(self.request, consumer)
        serializer = ConsumerSerializer(consumer)
        return Response(serializer.data)

class ConsumerInfoUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated, IsConsumerSelf]
    
    serializer_class = ConsumerInfoSerializer

    def get_object(self):
        email = self.request.query_params.get("email")

        if not email:
            return Response(
                {"detail": "Missing required parameters: email."},
                status=400,
            )
        return get_object_or_404(Consumer, user__email=email)


# CLUSTER VIEWS

class ClusterInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        cluster_id = request.query_params.get('cluster_id')
        if not cluster_id:
            return Response(
                {"detail": "Missing required parameters: cluster_id."},
                status=400,
            )
        cluster = get_object_or_404(Cluster, id=cluster_id)
        self.check_object_permissions(self.request, cluster)
        serializer = ClusterSerializer(cluster)
        return Response(serializer.data)

class ClusterConsumptionHourlyInRangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        cluster_id = request.query_params.get('cluster_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not cluster_id or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: cluster_id, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request, format=None):
        cluster_id = request.query_params.get('cluster_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not cluster_id or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: cluster_id, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request, format=None):
        cluster_id = request.query_params.get('cluster_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not cluster_id or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: cluster_id, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request, format=None):
        cluster_id = request.query_params.get('cluster_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not cluster_id or not start_date or not end_date:
            return Response(
                {"detail": "Missing required parameters: cluster_id, start_date, and/or end_date."},
                status=400,
            )

        try:
            start_date_dt = parser.isoparse(start_date)
            end_date_dt = parser.isoparse(end_date)
        except ValueError:
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

    def get(self, request):
        cluster_id = request.query_params.get('cluster_id')
        if not cluster_id:
            return Response(
                {"detail": "Missing required parameters: cluster_id."},
                status=400,
            )
        cluster = get_object_or_404(Cluster, id=cluster_id)
        aggregates = ClusterHourlyConsumptionAggregate.objects.filter(
            cluster=cluster
        )
        
        serializer = ClusterHourlyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)

class ClusterConsumptionDailyAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cluster_id = request.query_params.get('cluster_id')
        if not cluster_id:
            return Response(
                {"detail": "Missing required parameters: cluster_id."},
                status=400,
            )
        cluster = get_object_or_404(Cluster, id=cluster_id)
        aggregates = ClusterDailyConsumptionAggregate.objects.filter(cluster=cluster)
        serializer = ClusterDailyConsumptionAggregateSerializer(aggregates, many=True)
        return Response(serializer.data)

class ClusterConsumptionMonthlyAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cluster_id = request.query_params.get('cluster_id')
        if not cluster_id:
            return Response(
                {"detail": "Missing required parameters: cluster_id."},
                status=400,
            )
        cluster = get_object_or_404(Cluster, id=cluster_id)
        aggregates = ClusterMonthlyConsumptionAggregate.objects.filter(
            cluster=cluster
        )
        serializer = ClusterMonthlyConsumptionAggregateSerializer(
            aggregates, many=True
        )
        return Response(serializer.data)


# KWH VIEWS

class KwhPriceListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        if year:
            filter_args = {'year': year}
            if month:
                filter_args['month'] = month
            queryset = get_list_or_404(KwhPrice, **filter_args)
        else:
            return Response({'detail': 'Year parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = KwhPriceSerializer(queryset, many=True)
        return Response(serializer.data)


class KwhPriceCreateUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        month = request.data.get('month')
        year = request.data.get('year')
        price = request.data.get('price')
        
        if not (month and year and price is not None):
            return Response(
                {"detail": "Month, year, and price must be provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        obj, created = KwhPrice.objects.update_or_create(
            month=month, year=year,
            defaults={'price': price}
        )
        serializer = KwhPriceSerializer(obj)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)


class ForecastingMetricsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        forecasting_metrics = ForecastingMetrics.objects.first()
        serializer = ForecastingMetricsSerializer(forecasting_metrics, many=False)
        return Response(serializer.data)


class OutlierDetectionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        outliers_info = []
        clusters = Cluster.objects.all()

        for cluster in clusters:
            consumer_ids = Consumer.objects.filter(cluster=cluster).values_list('id', flat=True)
            
            for day in range(1, 7):
                aggregates = ConsumerDailyConsumptionAggregate.objects.filter(
                    consumer_id__in=consumer_ids, 
                    day=day
                )
                
                consumption_values = numpy.array([float(aggregate.consumption_kwh_sum) for aggregate in aggregates])
                
                if consumption_values.size > 0:
                    lower_bound, upper_bound = self.calculate_bounds(consumption_values)
                    
                    for aggregate in aggregates:
                        deviation_percentage = self.calculate_deviation(aggregate.consumption_kwh_sum, lower_bound, upper_bound)
                        
                        if aggregate.consumption_kwh_sum < lower_bound or aggregate.consumption_kwh_sum > upper_bound:
                            outliers_info.append({
                                'cluster_id': cluster.id,
                                'day': self.get_day(day),  # Use day name instead of number
                                'email': aggregate.consumer.user.email,
                                'consumption_kwh_sum': float(aggregate.consumption_kwh_sum),
                                'deviation_percentage': deviation_percentage,
                                'lower_bound': lower_bound,
                                'upper_bound': upper_bound
                            })

        serializer = OutliersInfoSerializer(data=outliers_info, many=True)
        if serializer.is_valid():
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.data, status=400)
        
    
    def calculate_bounds(self, data):
        Q1 = numpy.percentile(data, 25)
        Q3 = numpy.percentile(data, 75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 0.5 * IQR
        upper_bound = Q3 + 0.5 * IQR
        return lower_bound, upper_bound

    def calculate_deviation(self, value, lower_bound, upper_bound):
        value = float(value)
        median = lower_bound if value < lower_bound else upper_bound
        deviation = ((value - median) / median) * 100
        return deviation
    
    def get_day(self,day):
        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        return days[day-1]

