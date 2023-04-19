from django.db import models
from .custom_user import CustomUser


class Comment(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name="user who wrote comment", on_delete=models.PROTECT)
    created_at = models.DateTimeField(verbose_name="time of creation")
    updated_at = models.DateTimeField(verbose_name="time of last update")
    text = models.TextField(verbose_name="Comment")

    def __str__(self):
        return f'{self.user}: {self.text}'
