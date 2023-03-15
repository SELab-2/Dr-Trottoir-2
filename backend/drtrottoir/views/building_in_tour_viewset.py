from rest_framework import viewsets
from drtrottoir.models import BuildingInTour
from drtrottoir.serializers import BuildingInTourSerializer


class BuildingInTourViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = BuildingInTour.objects.all()
    serializer_class = BuildingInTourSerializer
    permission_classes = []
