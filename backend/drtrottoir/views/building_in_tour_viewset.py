from rest_framework import viewsets
from drtrottoir.models import BuildingInTour
from drtrottoir.serializers import BuildingSerializer


class BuildingInTourViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = BuildingInTour.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = []
