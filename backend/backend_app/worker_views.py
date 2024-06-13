from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .worker_serializers import WorkerAddConsumerConsumptionSerializer, WorkerGetLastConsumptionSerializer
from .permissions import IsWorker
from rest_framework.permissions import IsAuthenticated
from .models import ConsumerConsumption, Consumer
from django.db.models import Max, F, OuterRef , Subquery
from django.db.models.functions import Now, Coalesce
from django.db import transaction

class WorkerAddConsumerConsumptionView(APIView):
    permission_classes = [IsAuthenticated,IsWorker]
    
    def post(self, request, *args, **kwargs):
        serializer = WorkerAddConsumerConsumptionSerializer(data=request.data, many=True)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'detail': 'An error occurred while saving the data.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'detail': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class WorkerGetLastConsumptionView(APIView):
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request, *args, **kwargs):
        consumers = Consumer.objects.all().select_related('user')

        data = []
        for consumer in consumers:
            latest_consumption = ConsumerConsumption.timescale.filter(consumer=consumer).order_by('-datetime').first()
            data.append({
                'email': consumer.user.email,
                'power_supply_number' : consumer.power_supply_number,
                'datetime': latest_consumption.datetime if latest_consumption else None,
                'consumption_kwh': latest_consumption.consumption_kwh if latest_consumption else None,
            })

        return Response(data, status=status.HTTP_200_OK)