from drtrottoir.models import Schedule
from rest_framework import serializers


class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for schedules, showing tour info
    """

    class Meta:
        model = Schedule
        fields = ['url', 'date', 'student', 'tour']
