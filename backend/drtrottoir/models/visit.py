from django.db import models

from .building_in_tour import BuildingInTour
from .custom_user import CustomUser


class Visit(models.Model):
    arrival = models.DateTimeField(verbose_name="time of arrival")
    building_in_tour = models.ForeignKey(BuildingInTour,
                                         verbose_name="id of building in tour",
                                         on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, verbose_name="id of user", on_delete=models.CASCADE)
    comment = models.TextField(verbose_name="Comment on the visit", blank=True)

    def __str__(self):
        return f"{self.user.first_name}, {self.building_in_tour.building.nickname}: {self.arrival}"
