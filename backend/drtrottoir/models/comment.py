from django.db import models
from .custom_user import CustomUser
from django.dispatch import receiver
from django.db.models.signals import post_save
from datetime import datetime


class Comment(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name="user who wrote comment", on_delete=models.PROTECT)
    created_at = models.DateTimeField(verbose_name="time of creation", null=True)
    updated_at = models.DateTimeField(verbose_name="time of last update", null=True)
    text = models.TextField(verbose_name="Comment")

    def __str__(self):
        return f'{self.user}: {self.text}'


@receiver(post_save, sender=Comment)
def post_save_callback(sender, instance, created, *args, **kwargs):
    if created:
        instance.created_at = datetime.now()
    else:
        instance.updated_at = datetime.now()