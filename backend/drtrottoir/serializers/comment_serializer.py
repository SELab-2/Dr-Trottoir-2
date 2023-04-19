from drtrottoir.models import Comment, Building
from rest_framework import serializers


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for comment model
    """
    
    class Meta:
        model = Comment
        fields = '__all__'
