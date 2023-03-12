from drtrottoir.models import BuildingInTour
from rest_framework import serializers
from drtrottoir.models import Tour, Building


class BuildingInTourSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for a building in a tour
    """
    tour = serializers.PrimaryKeyRelatedField(queryset=Tour.objects.all())
    building = serializers.PrimaryKeyRelatedField(queryset=Building.objects.all())

    class Meta:
        model = BuildingInTour
        fields = '__all__'
