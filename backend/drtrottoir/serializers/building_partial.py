from drtrottoir.models import Building
from rest_framework import serializers


class BuildingPartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings, not showing recursive relations
    """
    region_name = serializers.CharField(
        source='region.region_name',
        read_only=True
    )

    class Meta:
        model = Building
        fields = [
            'url',
            'nickname',
            'region_name'
        ]
