from factory.django import DjangoModelFactory
import factory

from drtrottoir.models import Region


class RegionFactory(DjangoModelFactory):
    region_name = factory.Faker("city")

    class Meta:
        model = Region
