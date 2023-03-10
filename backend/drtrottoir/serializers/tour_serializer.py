from drtrottoir.models import Tour, Region
from drtrottoir.serializers import RegionSerializer
from rest_framework import serializers


class TourSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for tours and their associated location
    """
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all())

    # region = RegionSerializer

    class Meta:
        model = Tour
        fields = ['url', 'id', 'name', 'region']

    # def create(self, validated_data):
    #     print(validated_data)
    #     region_data = validated_data.pop('region')
    #     return Tour.objects.create(region=region_data, **validated_data)
