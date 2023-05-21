from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from drtrottoir.models import Schedule, Visit, ScheduleComment
from drtrottoir.permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import ScheduleSerializer, VisitSerializer, ScheduleCommentSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows regions to be viewed or edited.
    """

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]

    class Meta:
        ordering = ['id']

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

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        # Check if schedule id is valid
        if pk is None or not Schedule.objects.filter(pk=pk).exists():
            return Response("Given schedule does not exist.", status=status.HTTP_400_BAD_REQUEST)
        # Get visits corresponding with schedule
        scheduleComments = ScheduleComment.objects.filter(schedule=pk)
        return Response(ScheduleCommentSerializer(list(scheduleComments), many=True, context={'request': request}).data)
