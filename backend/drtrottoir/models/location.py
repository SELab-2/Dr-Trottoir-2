from django.db import models


class Location(models.Model):
    """
    Address of a building/person
    """
    street = models.CharField(verbose_name="street", max_length=256)
    number = models.CharField(verbose_name="house number", max_length=10)
    zip_code = models.IntegerField(verbose_name="zip code")
    city = models.CharField(verbose_name="cityname", max_length=256)
    country = models.CharField(verbose_name="countryname", max_length=256)
