from django.db import models


class Region(models.Model):
    """
    Region to link with a building or person
    """
    region_name = models.CharField(verbose_name="name of the region", max_length=256)

    def __str__(self):
        return self.region_name
