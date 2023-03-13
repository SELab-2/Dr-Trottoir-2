from drtrottoir.models import Region
from rest_framework import serializers


class RegionSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for regions
    """

    class Meta:
        model = Region
        fields = '__all__'
