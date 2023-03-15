from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Building
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import BuildingSerializer


class BuildingViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a building to be retrieved. Authentication required.

    list:
    API endpoint that allows all buildings to be retrieved. Authentication required.

    create:
    API endpoint that allows a building to be created. Superstudent role or above required.

    update:
    API endpoint that allows a building to be updated. Superstudent role or above required.

    partial_update:
    API endpoint that allows a building to be updated. Superstudent role or above required.

    destroy:
    API endpoint that allows a building to be deleted. Superstudent role or above required.
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
