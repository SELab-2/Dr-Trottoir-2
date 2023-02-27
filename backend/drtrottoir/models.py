from django.db import models

# Building
class Building(models.Model):
    """
    Definition of a building: location where students have to 
    """
    nickname = models.CharField("short name for building", max_length=255)
    address = models.CharField("building address", max_length=255)
    description = models.CharField("building description", max_length=4095)
