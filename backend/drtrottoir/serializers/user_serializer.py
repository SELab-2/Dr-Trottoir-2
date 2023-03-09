from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    A serializer for CustomUser
    """
    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'email']
        read_only_field = ['is_active']
