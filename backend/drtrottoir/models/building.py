from django.db import models

from .location import Location


class Building(models.Model):
    nickname = models.CharField("short name for building", max_length=255)
    description = models.CharField("building description", max_length=4095)
    name = models.CharField(verbose_name="name of building", max_length=256)
    manual = models.FileField(verbose_name="manual", upload_to='files/', null=True)
    location = models.ForeignKey(Location, verbose_name="adress of building", on_delete=models.CASCADE)
    # waste schedule
