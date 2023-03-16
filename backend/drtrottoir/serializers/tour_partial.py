from drtrottoir.models import Tour
from rest_framework import serializers


class TourPartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings, not showing recursive relations
    """
    region_name = serializers.CharField(
        source='region.region_name',
        read_only=True
    )

    class Meta:
        model = Tour
        fields = [
            'url',
            'name',
            'region_name'
        ]
