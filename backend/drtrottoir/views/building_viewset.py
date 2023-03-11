from drtrottoir.models import Building
from drtrottoir.serializers import BuildingSerializer
from rest_framework import viewsets


class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = []
