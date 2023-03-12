from rest_framework import serializers
from drtrottoir.models import Visit


class VisitSerializer(serializers.ModelSerializer):
    """
    A serializer for visits
    """
    
    class Meta:
        model = Visit
        fields = '__all__'
