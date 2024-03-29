from factory.django import DjangoModelFactory
import factory
from django.utils import timezone
from drtrottoir.models import Visit
from .building_in_tour_factory import BuildingInTourFactory
from .user_factory import StudentUserFactory
from .schedule_factory import ScheduleFactory


class VisitFactory(DjangoModelFactory):
    user = factory.SubFactory(StudentUserFactory)
    building_in_tour = factory.SubFactory(BuildingInTourFactory)
    arrival = factory.Faker("date_time", tzinfo=timezone.utc)
    schedule = factory.SubFactory(ScheduleFactory)

    class Meta:
        model = Visit
