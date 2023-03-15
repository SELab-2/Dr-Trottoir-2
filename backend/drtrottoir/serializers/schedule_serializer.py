from drtrottoir.models import Schedule
from rest_framework import serializers
from .user_partial import UserPartialSerializer
from .tour_partial import TourPartialSerializer


class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for schedules, showing tour info
    """
    student = UserPartialSerializer(read_only=True)
    tour = TourPartialSerializer(read_only=True)

    class Meta:
        model = Schedule
        fields = ['url', 'date', 'student', 'tour', 'comment']
