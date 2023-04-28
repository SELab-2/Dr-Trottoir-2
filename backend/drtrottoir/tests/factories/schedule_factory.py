from factory.django import DjangoModelFactory
import factory
from drtrottoir.models import Schedule
from .user_factory import StudentUserFactory
from .tour_factory import TourFactory


class ScheduleFactory(DjangoModelFactory):
    date = date = factory.Faker("date")
    student = factory.SubFactory(StudentUserFactory)
    tour = factory.SubFactory(TourFactory)

    class Meta:
        model = Schedule
