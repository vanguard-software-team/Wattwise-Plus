from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .worker_serializers import WorkerAddConsumerConsumptionSerializer, WorkerGetLastConsumptionSerializer
from .permissions import IsWorker
from rest_framework.permissions import IsAuthenticated
from .models import ConsumerConsumption
from django.db.models import Max, F

class WorkerAddConsumerConsumptionView(APIView):
    permission_classes = [IsAuthenticated,IsWorker]
    
    def post(self, request, *args, **kwargs):
        serializer = WorkerAddConsumerConsumptionSerializer(data=request.data, many=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

#TODO: Fix the following view
class WorkerGetLastConsumptionView(APIView):
    permission_classes = [IsAuthenticated, IsWorker]
    
    def get(self, request, *args, **kwargs):
        latest_consumptions = ConsumerConsumption.objects.annotate(
            latest_datetime=Max('consumer__consumptions__datetime')
        ).filter(
            datetime=F('latest_datetime')
        ).order_by('consumer')

        serializer = WorkerGetLastConsumptionSerializer(latest_consumptions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)