from drtrottoir.models import Location
from rest_framework import serializers


class LocationSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for locations
    """
    class Meta:
        model = Location
        fields = ['url', 'street', 'number', 'zip_code', 'city', 'country']
