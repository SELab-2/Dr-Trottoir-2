from drtrottoir.models import Waste
from rest_framework import serializers
from .building_partial import BuildingPartialSerializer


class WasteSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for waste model
    """
    building = BuildingPartialSerializer()

    class Meta:
        model = Waste
        fields = '__all__'
