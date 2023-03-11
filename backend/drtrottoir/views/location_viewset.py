from drtrottoir.models import Location
from drtrottoir.serializers import LocationSerializer
from rest_framework import viewsets


class LocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = []
