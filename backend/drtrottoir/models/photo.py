from django.db import models
from .building import Building

IMAGE_STATES = ((1, 'Arrival'), (2, 'Departure'), (3, 'Extra'))


class Photo(models.Model):
    # image = models.ImageField(verbose_name="image", upload_to="images/") Pillow needs to be set up
    visit = models.ForeignKey(Building, verbose_name="id of visit", on_delete=models.CASCADE)
    state = models.IntegerField(verbose_name="type of photo", choices=IMAGE_STATES)
    comment = models.TextField(verbose_name="comment on the photo")
    created_at = models.DateTimeField(verbose_name="time of creation")

    def __str__(self):
        return f"{self.visit.name}, {self.created_at}"
