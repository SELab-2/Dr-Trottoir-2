from drtrottoir.models import Waste
from rest_framework import serializers

class WasteSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for regions
    """

    class Meta:
        model = Waste
        fields = '__all__'