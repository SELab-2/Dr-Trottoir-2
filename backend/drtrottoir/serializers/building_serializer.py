from drtrottoir.models import Building
from rest_framework import serializers
from .location_serializer import LocationSerializer


class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings and their associated location
    """
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Building
        fields = ['url', 'nickname', 'description', 'name', 'manual', 'location']
