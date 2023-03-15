from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Building
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import BuildingSerializer


class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
