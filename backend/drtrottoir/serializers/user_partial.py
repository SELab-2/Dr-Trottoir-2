from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserPartialSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for CustomUser, not showing recursive relations
    """
    url = serializers.HyperlinkedIdentityField(view_name='user-detail', read_only=True)

    class Meta:
        model = User
        fields = [
            'url',
            'email',
            'first_name',
            'last_name'
        ]
        read_only_field = ['is_active']


