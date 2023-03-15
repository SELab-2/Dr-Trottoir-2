from django.db import models
from .region import Region


class Building(models.Model):
    nickname = models.CharField("short name for building", max_length=255)
    description = models.CharField("building description", max_length=4095)
    manual = models.FileField(verbose_name="manual", upload_to='files/', null=True)

    address_line_1 = models.CharField(verbose_name="address line 1", max_length=256)
    address_line_2 = models.CharField(verbose_name="address line 1", max_length=256)
    country = models.CharField(verbose_name="countryname", max_length=256)

    region = models.ForeignKey(Region, verbose_name="region of building", on_delete=models.PROTECT)
    # waste schedule

    def __str__(self):
        return self.nickname
