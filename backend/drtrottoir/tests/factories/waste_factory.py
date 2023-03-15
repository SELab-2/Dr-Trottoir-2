from factory.django import DjangoModelFactory
import factory

from drtrottoir.models import Waste
from drtrottoir.tests.factories import BuildingFactory


class WasteFactory(DjangoModelFactory):
    date = factory.Faker("date")
    waste_type = factory.Faker("word")
    building = factory.SubFactory(BuildingFactory)

    class Meta:
        model = Waste
