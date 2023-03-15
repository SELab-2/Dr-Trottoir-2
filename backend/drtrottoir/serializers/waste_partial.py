from drtrottoir.models import Waste
from rest_framework import serializers


class WastePartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A partial serializer for waste model
    """

    class Meta:
        model = Waste
        fields = [
            "url",
            "date",
            "waste_type",
        ]