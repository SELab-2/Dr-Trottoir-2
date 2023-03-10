from drtrottoir.models import Building
from rest_framework import serializers
from .region_serializer import RegionSerializer


class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings and their associated location
    """
    region = RegionSerializer(read_only=True)
    class Meta:
        model = Building
        fields = [
            'url',
            'nickname',
            'description',
            'name',
            'manual',
            'address_line_1',
            'address_line_2',
            'country',
            'region'
        ]
