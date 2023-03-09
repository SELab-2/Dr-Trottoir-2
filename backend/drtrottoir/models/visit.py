from django.db import models
from .custom_user import CustomUser
from .building import Building


class Visit(models.Model):
    arrival = models.DateTimeField(verbose_name="time of arrival")
    building = models.ForeignKey(Building, verbose_name="id of building", on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, verbose_name="id of user", on_delete=models.CASCADE)
    comment = models.TextField(verbose_name="Comment on the visit", blank=True)
