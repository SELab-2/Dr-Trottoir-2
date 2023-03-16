from drtrottoir.models import BuildingInTour
from rest_framework import serializers


class BuildingInTourPartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings in tours, not showing recursive relations
    """
    building_data = serializers.SerializerMethodField()
    tour_name = serializers.SerializerMethodField()

    class Meta:
        model = BuildingInTour
        fields = [
            'url',
            'order_index',
            'building',
            'building_data',
            'tour',
            'tour_name'
        ]

    def get_building_data(self, obj):
        building = obj.building
        return {"nickname": building.nickname, "description": building.description}

    def get_tour_name(self, obj):
        return obj.tour.name
