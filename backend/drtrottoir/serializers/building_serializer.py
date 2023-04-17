from drtrottoir.models import Building
from rest_framework import serializers
from .user_partial import UserPartialSerializer


class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings and their associated location
    """
    region_name = serializers.CharField(
        source='region.region_name',
        read_only=True
    )
    owners = UserPartialSerializer(many=True, read_only=True)

    class Meta:
        model = Building
        fields = '__all__'
