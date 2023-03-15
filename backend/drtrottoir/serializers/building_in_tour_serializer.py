from drtrottoir.models import BuildingInTour, Building, Tour
from rest_framework import serializers


class BuildingInTourSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for a building in a specific tour
    """
    tour = serializers.PrimaryKeyRelatedField(queryset=Tour.objects.all(), many=False)
    building = serializers.PrimaryKeyRelatedField(queryset=Building.objects.all(), many=False)

    class Meta:
        model = BuildingInTour
        fields = ['url', 'tour', 'building', 'order_index']