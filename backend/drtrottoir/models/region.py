from django.db import models


class Region(models.Model):
    """
    Region to link with a building or person
    """
    region = models.CharField(verbose_name="name of the region", max_length=256)
