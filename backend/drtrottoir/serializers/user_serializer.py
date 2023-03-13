from rest_framework import serializers
from django.contrib.auth import get_user_model
from .building_partial import BuildingPartialSerializer

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for CustomUser
    """
    buildings = BuildingPartialSerializer(read_only=True, many=True)
    region_name = serializers.CharField(source='region.region_name', read_only=True)
    class Meta:
        model = User
        fields = '__all__'
        read_only_field = ['is_active']
