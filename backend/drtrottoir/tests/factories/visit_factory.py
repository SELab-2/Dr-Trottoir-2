from factory.django import DjangoModelFactory
import factory
from django.utils import timezone
from drtrottoir.models import Visit
from .building_factory import BuildingFactory
from .user_factory import DeveloperUserFactory


class VisitFactory(DjangoModelFactory):
    user = factory.SubFactory(DeveloperUserFactory)
    building = factory.SubFactory(BuildingFactory)
    arrival = factory.Faker("date_time", tzinfo=timezone.utc)
    comment = factory.Faker("sentence")

    class Meta:
        model = Visit
