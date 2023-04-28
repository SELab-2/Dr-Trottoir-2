from drtrottoir.models import Schedule, ScheduleComment, VisitComment, Building, CustomUser
from rest_framework import serializers


class ScheduleCommentSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for schedule_comment model
    """

    class Meta:
        model = ScheduleComment
        fields = '__all__'


class VisitCommentSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for visit_comment model
    """

    class Meta:
        model = VisitComment
        fields = '__all__'
