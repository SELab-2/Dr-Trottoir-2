from django.db import models
from .comment import Comment
from .schedule import Schedule
from .building import Building


class ScheduleComment(Comment):
    schedule = models.ForeignKey(Schedule, verbose_name="schedule commented", on_delete=models.CASCADE)
    building = models.ForeignKey(Building, verbose_name="building commented", on_delete=models.CASCADE)
