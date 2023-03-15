from django.db import models
from .building import Building


class Waste(models.Model):
    date = models.DateField("Date of waste collection")
    waste_type = models.CharField("Type of waste", max_length=256)

    building = models.ForeignKey(Building, verbose_name="building of waste collection", on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.waste_type}, {self.building.nickname}, {self.date}'
