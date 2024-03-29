from django.db import models

from .custom_user import CustomUser
from .tour import Tour


class Schedule(models.Model):
    date = models.DateField(verbose_name="date of the schedule")
    student = models.ForeignKey(CustomUser, verbose_name="id of user", on_delete=models.PROTECT)
    tour = models.ForeignKey(Tour, verbose_name="id of the scheduled tour", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.date}: {self.tour}"
