"""
This module contains serializers for the models defined in models.py
"""

from .models import Building
from rest_framework import serializers
from django.contrib.auth.admin import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    A serializer for CustomUser
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_field = ['is_active']

class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for buildings
    """
    class Meta:
        model = Building
        fields = ['url', 'nickname', 'address', 'description']
