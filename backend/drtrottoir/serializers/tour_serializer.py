from drtrottoir.models import Tour
from drtrottoir.serializers import LocationSerializer
from rest_framework import serializers


class TourSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for tours and their associated location
    """
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Tour
        fields = ['url', 'name', 'version', 'location']
