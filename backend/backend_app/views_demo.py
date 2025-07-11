# for demo purposes

from rest_framework import status
from rest_framework.response import Response
from .serializers import (
    AddConsumerConsumptionSerializer,
    AddConsumerForecastingSerializer,
    AddClusterConsumptionSerializer
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import (
    CustomUser,
    Cluster,
    ConsumerConsumption,
    ForecastingConsumerConsumption,
    ClusterConsumption,
)
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


class AddConsumerForecastingView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        consumer_consumption_instances = []
        errors = []

        for item in request.data:
            serializer = AddConsumerForecastingSerializer(data=item)
            if serializer.is_valid():
                validated_data = serializer.validated_data

                email = validated_data.pop('email')
                user = CustomUser.objects.get(email=email)
                consumer_profile = user.consumer_profile
                
                validated_data['consumer'] = consumer_profile
                
                consumer_consumption_instances.append(ForecastingConsumerConsumption(**validated_data))
            else:
                errors.append(serializer.errors)

        if errors:
            return Response({'detail': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                ForecastingConsumerConsumption.objects.bulk_create(consumer_consumption_instances)
                return Response({'detail': 'Batch inserted successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': f'An error occurred while saving the data: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddClusterConsumptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cluster_consumption_instances = []
        errors = []

        for item in request.data:
            serializer = AddClusterConsumptionSerializer(data=item)
            if serializer.is_valid():
                validated_data = serializer.validated_data

                cluster_id = validated_data.pop('cluster_id')
                cluster = Cluster.objects.get(id=cluster_id)
                validated_data['cluster'] = cluster
                
                cluster_consumption_instances.append(ClusterConsumption(**validated_data))
            else:
                errors.append(serializer.errors)

        if errors:
            return Response({'detail': errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                ClusterConsumption.objects.bulk_create(cluster_consumption_instances)
                return Response({'detail': 'Batch inserted successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': f'An error occurred while saving the data: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)