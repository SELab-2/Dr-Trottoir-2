from factory.django import DjangoModelFactory
import factory
from drtrottoir.models import Building
from drtrottoir.tests.factories import RegionFactory


class BuildingFactory(DjangoModelFactory):
    nickname = factory.Faker("name")
    description = factory.Faker("text")
    address_line_1 = factory.Faker("address")
    address_line_2 = factory.Faker("address")
    country = factory.Faker("country")
    region = factory.SubFactory(RegionFactory)

    class Meta:
        model = Building
