from django.db import models
from .custom_user import CustomUser
from .visit import Visit
from .schedule import Schedule
from .building import Building


class Comment(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name="user who wrote comment", on_delete=models.PROTECT)
    created_at = models.DateTimeField(verbose_name="time of creation")
    updated_at = models.DateTimeField(verbose_name="time of last update", null=True)
    text = models.TextField(verbose_name="Comment")

    def __str__(self):
        return f'{self.user}: {self.text}'

    class Meta:
        abstract = True


class ScheduleComment(Comment):
    schedule = models.ForeignKey(Schedule, verbose_name="schedule commented", on_delete=models.CASCADE)
    building = models.ForeignKey(Building, verbose_name="building commented", on_delete=models.CASCADE)


class VisitComment(Comment):
    visit = models.ForeignKey(Visit, verbose_name="visit commented", on_delete=models.CASCADE)
