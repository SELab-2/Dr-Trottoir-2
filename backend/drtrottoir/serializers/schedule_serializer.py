from drtrottoir.models import Schedule
from rest_framework import serializers
from .user_partial import UserPartialSerializer


class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for schedules, showing tour info
    """
    student = UserPartialSerializer(read_only=True)
    tour = serializers.CharField(
        source='tour.name',
        read_only=True
    )

    class Meta:
        model = Schedule
        fields = ['date', 'student', 'tour', 'comment']
