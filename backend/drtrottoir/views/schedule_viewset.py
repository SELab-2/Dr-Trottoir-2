from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Schedule
from drtrottoir.permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import ScheduleSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows regions to be viewed or edited.
    """

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
