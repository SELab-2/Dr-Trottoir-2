from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserPartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for CustomUser, not showing recursive relations
    """

    class Meta:
        model = User
        fields = [
            'url',
            'email',
            'first_name',
            'last_name',
            'role'
        ]
        read_only_field = ['is_active']
