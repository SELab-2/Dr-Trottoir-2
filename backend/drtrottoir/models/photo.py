from django.db import models
from .visit import Visit
from django.dispatch import receiver
from django.db.models.signals import pre_delete, post_save
from PIL import Image
from datetime import datetime

IMAGE_STATES = ((1, 'Arrival'), (2, 'Departure'), (3, 'Extra'))


class Photo(models.Model):
    image = models.ImageField(verbose_name="image", upload_to="images/", null=True)
    visit = models.ForeignKey(Visit, verbose_name="id of visit", on_delete=models.CASCADE)
    state = models.IntegerField(verbose_name="type of photo", choices=IMAGE_STATES)
    comment = models.TextField(verbose_name="comment on the photo")
    created_at = models.DateTimeField(verbose_name="time of creation", null=True)

    def __str__(self):
        return f"{self.visit}, {self.created_at}"


@receiver(pre_delete, sender=Photo)
def pre_delete(sender, instance: Photo, **kwargs):
    instance.image.delete()


@receiver(post_save, sender=Photo)
def post_save_callback(sender, instance, created, *args, **kwargs):
    if created:
        try:
            # exif tag 36867 is DateTimeOriginal
            # https://www.awaresystems.be/imaging/tiff/tifftags/privateifd/exif.html
            instance.created_at = Image.open(instance.image.path)._getexif()[36867]
        except Exception:  # When DateTimeOriginal is not found in the metadata store current time
            instance.created_at = datetime.now()
