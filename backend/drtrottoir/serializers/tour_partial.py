from rest_framework import serializers
from drtrottoir.models import Tour


class TourPartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A partial serializer for Tour, not showing recursive relations
    """
    region_name = serializers.CharField(source='region.region_name', read_only=True)

    class Meta:
        model = Tour
        fields = [
            'url',
            'name',
            'region_name'
        ]
