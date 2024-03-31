# for demo purposes

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
from django.db import transaction



class AddConsumerConsumptionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        consumer_consumption_instances = []
        errors = []

        for item in request.data:
            serializer = AddConsumerConsumptionSerializer(data=item)
            if serializer.is_valid():
                validated_data = serializer.validated_data

                email = validated_data.pop('email')
                user = CustomUser.objects.get(email=email)
                consumer_profile = user.consumer_profile
                
                validated_data['consumer'] = consumer_profile
                
                consumer_consumption_instances.append(ConsumerConsumption(**validated_data))
            else:
                errors.append(serializer.errors)

        if errors:
            return Response({'detail': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                ConsumerConsumption.objects.bulk_create(consumer_consumption_instances)
                return Response({'detail': 'Batch inserted successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': f'An error occurred while saving the data: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
