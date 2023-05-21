from django.db import models


class Template(models.Model):
    to = models.TextField(blank=True, default="")
    cc = models.TextField(blank=True, default="")
    bcc = models.TextField(blank=True, default="")
    subject = models.TextField(blank=True, default="")
    body = models.TextField(blank=True, default="")

    def __str__(self):
        return f"{self.subject}"
