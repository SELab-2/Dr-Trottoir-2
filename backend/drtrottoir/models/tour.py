from django.db import models
from .location import Location


class Tour(models.Model):
    name = models.CharField(verbose_name="name of the tour", max_length=256)
    version = models.IntegerField(verbose_name="version of the tour")
    location = models.ForeignKey(Location, verbose_name="location of the tour", on_delete=models.CASCADE)
