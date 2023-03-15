from drtrottoir.models import Waste, Building
from rest_framework import serializers


class WasteSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for waste model
    """
    building = serializers.HyperlinkedRelatedField(queryset=Building.objects.all(), view_name='building-detail')

    class Meta:
        model = Waste
        fields = '__all__'
