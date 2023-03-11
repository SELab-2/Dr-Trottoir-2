from django.db import models
from .region import Region


class Tour(models.Model):
    name = models.CharField(verbose_name="name of the tour", max_length=256)
    region = models.ForeignKey(Region, verbose_name="region of the tour", on_delete=models.PROTECT)

    def __str__(self):
        return self.name
