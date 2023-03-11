from drtrottoir.models import Tour, Region
from drtrottoir.serializers import RegionSerializer
from rest_framework import serializers


class TourSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for tours and their associated location
    """
    #region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all())
    region_name = serializers.CharField(source='region.region_name', read_only=True)

    class Meta:
        model = Tour
        fields = '__all__'

