from factory.django import DjangoModelFactory
import factory

from drtrottoir.models import Waste
from .building_factory import BuildingFactory


class WasteFactory(DjangoModelFactory):
    date = factory.Faker("date")
    waste_type = factory.Faker("word")
    building = factory.SubFactory(BuildingFactory)
    action = factory.Faker("word")

    class Meta:
        model = Waste
