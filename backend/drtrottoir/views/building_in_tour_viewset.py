from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from drtrottoir.models import BuildingInTour
from drtrottoir.permissions.super_permission import SuperPermissionOrReadOnly
from drtrottoir.serializers import BuildingInTourSerializer
from rest_framework.response import Response

class BuildingInTourViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings ina specific tour to be viewed or edited.
    """
    queryset = BuildingInTour.objects.all()
    serializer_class = BuildingInTourSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]