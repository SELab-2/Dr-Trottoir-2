from rest_framework import serializers
from drtrottoir.models import Visit
from .building_partial import BuildingPartialSerializer
from .building_in_tour_partial import BuildingInTourPartialSerializer
from .user_partial import UserPartialSerializer


class VisitSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for visits
    """

    user = UserPartialSerializer()
    # building = BuildingPartialSerializer()
    building_in_tour = BuildingInTourPartialSerializer()

    class Meta:
        model = Visit
        fields = '__all__'
