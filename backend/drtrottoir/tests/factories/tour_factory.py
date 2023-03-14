from factory.django import DjangoModelFactory
import factory
from drtrottoir.models import Tour
from .region_factory import RegionFactory


class TourFactory(DjangoModelFactory):
    name = factory.Faker("city")
    region = factory.SubFactory(RegionFactory)

    class Meta:
        model = Tour
