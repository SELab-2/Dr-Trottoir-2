from drtrottoir.models import Building
from rest_framework import serializers


class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings and their associated location
    """
    region_name = serializers.CharField(source='region.region_name', read_only=True)

    class Meta:
        model = Building
        fields = '__all__'
