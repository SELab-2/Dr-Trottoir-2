from drtrottoir.models import ScheduleComment, VisitComment
from .user_partial import UserPartialSerializer
from rest_framework import serializers


class ScheduleCommentSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for schedule_comment model
    """

    class Meta:
        model = ScheduleComment
        fields = '__all__'


class ScheduleCommentExtraSerializer(ScheduleCommentSerializer):
    """
    A version containing more fields
    """
    user = UserPartialSerializer(read_only=True)


class VisitCommentSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for visit_comment model
    """

    class Meta:
        model = VisitComment
        fields = '__all__'


class VisitCommentExtraSerializer(VisitCommentSerializer):
    """
    A version containing more fields
    """
    user = UserPartialSerializer(read_only=True)
