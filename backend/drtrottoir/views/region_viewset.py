from rest_framework import viewsets
from drtrottoir.models import Region
from drtrottoir.serializers import RegionSerializer


class RegionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows regions to be viewed or edited.
    """
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = []
