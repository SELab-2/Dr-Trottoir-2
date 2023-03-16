from rest_framework import serializers
from drtrottoir.models import Photo


class PhotoSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for photos
    """

    class Meta:
        model = Photo
        fields = '__all__'
