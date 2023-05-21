from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from drtrottoir.models import BuildingInTour
from drtrottoir.permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import BuildingInTourSerializer


class BuildingInTourViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a connection between a building and a tour to be retrieved. Authentication required.

    list:
    API endpoint that allows all buildings in tours to be retrieved. Authentication required.

    create:
    API endpoint that allows a buildings to be added to a tour. Superstudent role or above required.

    update: API endpoint that allows a connection between a building and a tour to be updated. Superstudent role or
    above required.

    partial_update: API endpoint that allows a connection between a building and a tour to be updated. Superstudent
    role or above required.

    destroy: API endpoint that allows a connection between a building and a tour to be deleted. Superstudent role or
    above required.
    """
    queryset = BuildingInTour.objects.all()
    serializer_class = BuildingInTourSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]

    class Meta:
        ordering = ['id']
