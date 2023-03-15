from rest_framework import serializers
from drtrottoir.models import Visit
from .building_partial import BuildingPartialSerializer
from .user_partial import UserPartialSerializer
from .tour_partial import TourPartialSerializer


class VisitSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for visits
    """

    user = UserPartialSerializer()
    building = BuildingPartialSerializer()
    tour = TourPartialSerializer()

    class Meta:
        model = Visit
        fields = '__all__'
