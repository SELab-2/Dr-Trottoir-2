"""
This module contains serializers for the models defined in models.py
"""

from .models import Building
from rest_framework import serializers


class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings
    """
    class Meta:
        model = Building
        fields = ['url', 'nickname', 'address', 'description']
