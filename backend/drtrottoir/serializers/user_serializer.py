from django.contrib.auth import get_user_model
from .building_partial import BuildingPartialSerializer
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for CustomUser
    """
    buildings = BuildingPartialSerializer(read_only=True, many=True)
    region_name = serializers.CharField(
        source='region.region_name',
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            'url',
            'email',
            'last_login',
            'first_name',
            'last_name',
            'region',
            'region_name',
            'role',
            'buildings',
            'phone',
            'is_active'
        ]
