from drtrottoir.models import BuildingInTour
from rest_framework import serializers
from .building_partial import BuildingPartialSerializer
from .tour_partial import TourPartialSerializer


class BuildingInTourPartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings in tours, not showing recursive relations
    """
    building = BuildingPartialSerializer()
    tour = TourPartialSerializer()

    class Meta:
        model = BuildingInTour
        fields = [
            'building',
            'order_index'
        ]
