from factory.django import DjangoModelFactory
import factory

from drtrottoir.models import Visit
from .building_factory import BuildingFactory
from .user_factory import DeveloperUserFactory


class VisitFactory(DjangoModelFactory):
    user = factory.SubFactory(DeveloperUserFactory)
    building = factory.SubFactory(BuildingFactory)
    arrival = factory.Faker("date_time")
    comment = factory.Faker("sentence")

    class Meta:
        model = Visit
