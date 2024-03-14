from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .worker_serializers import WorkerAddConsumerConsumptionSerializer, WorkerGetLastConsumptionSerializer
from .permissions import IsWorker
from rest_framework.permissions import IsAuthenticated
from .models import ConsumerConsumption
from django.db.models import Max, F, OuterRef , Subquery

class WorkerAddConsumerConsumptionView(APIView):
    permission_classes = [IsAuthenticated,IsWorker]
    
    def post(self, request, *args, **kwargs):
        serializer = WorkerAddConsumerConsumptionSerializer(data=request.data, many=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class WorkerGetLastConsumptionView(APIView):
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request, *args, **kwargs):
        latest_consumption_dates = ConsumerConsumption.objects.filter(
            consumer=OuterRef('consumer')
        ).order_by('-datetime').values('datetime')[:1]

        latest_consumptions = ConsumerConsumption.objects.annotate(
            latest_datetime=Subquery(latest_consumption_dates)
        ).filter(
            datetime=F('latest_datetime')
        ).select_related('consumer__user').order_by('consumer')

        serializer = WorkerGetLastConsumptionSerializer(latest_consumptions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)