from drtrottoir.models import BuildingInTour
from rest_framework import serializers
from drtrottoir.models import Tour, Building


class BuildingInTourSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for a building in a tour
    """
    tour = serializers.HyperlinkedRelatedField(queryset=Tour.objects.all(), view_name='tour-detail')
    building = serializers.HyperlinkedRelatedField(queryset=Building.objects.all(), view_name='building-detail')

    class Meta:
        model = BuildingInTour
        fields = '__all__'
