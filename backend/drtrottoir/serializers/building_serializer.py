from drtrottoir.models import Building
from rest_framework import serializers


class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings
    """
    class Meta:
        model = Building
        fields = ['url', 'nickname', 'description', 'name', 'manual', 'location']

