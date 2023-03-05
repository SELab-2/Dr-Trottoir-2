from django.db import models
import uuid
from .building import Building
from .tour import Tour


class BuildingInTour(models.Model):
    tour = models.ForeignKey(Tour, verbose_name="id of tour", on_delete=models.CASCADE)
    building = models.ForeignKey(Building, verbose_name="id of building", on_delete=models.CASCADE)
    order_index = models.IntegerField(verbose_name="order index of the building in the tour")
