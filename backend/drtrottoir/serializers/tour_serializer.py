from drtrottoir.models import Tour
from drtrottoir.serializers import LocationSerializer
from rest_framework import serializers


class TourSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for tours and their associated location
    """
    location = LocationSerializer()

    class Meta:
        model = Tour
        fields = ['url', 'name', 'version', 'location']

    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location_serializer = LocationSerializer(data=location_data)
        location_serializer.is_valid(raise_exception=True)
        location = location_serializer.save()
        tour = Tour.objects.create(location=location, **validated_data)
        return tour
