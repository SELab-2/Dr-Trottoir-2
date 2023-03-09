from rest_framework import viewsets
from drtrottoir.models import Location
from drtrottoir.serializers import LocationSerializer


class LocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = []
