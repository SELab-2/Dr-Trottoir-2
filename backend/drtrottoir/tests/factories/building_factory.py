from factory.django import DjangoModelFactory, FileField
import factory

from drtrottoir.models import Building
from drtrottoir.tests.factories import RegionFactory

class BuildingFactory(DjangoModelFactory):
    nickname = factory.Faker("name")
    region = factory.SubFactory(RegionFactory)
    description = factory.Faker("sentence")
    manual = FileField(filename="manual.pdf")
    address_line_1 = factory.Faker("address")
    address_line_2 = factory.Faker("address")

    class Meta:
        model = Building
