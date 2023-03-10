from rest_framework import viewsets
from drtrottoir.models import Building
from drtrottoir.serializers import BuildingSerializer

class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = []
