from factory.django import DjangoModelFactory
import factory
from drtrottoir.models import Tour
from drtrottoir.tests.factories import RegionFactory


class TourFactory(DjangoModelFactory):
    name = factory.Faker("name")
    region = factory.SubFactory(RegionFactory)

    class Meta:
        model = Tour
