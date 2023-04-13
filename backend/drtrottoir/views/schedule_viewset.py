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
