from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from drtrottoir.models import Schedule, Visit
from drtrottoir.permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import ScheduleSerializer, VisitSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows regions to be viewed or edited.
    """

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]

    # Get visits for schedule
    @action(detail=True, methods=['get'])
    def visits(self, request, pk=None):
        # Check if schedule id is valid
        if pk is None or not Schedule.objects.filter(pk=pk).exists():
            return Response("Given schedule does not exist.", status=status.HTTP_400_BAD_REQUEST)
        # Get visits corresponding with schedule
        visits = Visit.objects.filter(schedule=pk)
        # Return VisitSerializer
        return Response(VisitSerializer(list(visits), many=True, context={'request': request}).data)
