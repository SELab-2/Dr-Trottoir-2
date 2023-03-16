from factory.django import DjangoModelFactory
import factory
from django.utils import timezone
from drtrottoir.models import Visit
from .building_in_tour_factory import BuildingInTourFactory
from .user_factory import DeveloperUserFactory


class VisitFactory(DjangoModelFactory):
    user = factory.SubFactory(DeveloperUserFactory)
    building_in_tour = factory.SubFactory(BuildingInTourFactory)
    arrival = factory.Faker("date_time", tzinfo=timezone.utc)
    comment = factory.Faker("sentence")

    class Meta:
        model = Visit
