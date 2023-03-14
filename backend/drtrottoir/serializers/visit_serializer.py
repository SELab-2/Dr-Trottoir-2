from rest_framework import serializers
from drtrottoir.models import Visit
from .building_partial import BuildingPartialSerializer
from .user_partial import UserPartialSerializer


class VisitSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for visits
    """

    user = UserPartialSerializer()
    building = BuildingPartialSerializer()

    class Meta:
        model = Visit
        fields = '__all__'
