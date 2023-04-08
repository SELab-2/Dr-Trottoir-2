from factory.django import DjangoModelFactory
import factory
from drtrottoir.models import Schedule
from drtrottoir.tests.factories import StudentUserFactory, TourFactory


class ScheduleFactory(DjangoModelFactory):
    date = date = factory.Faker("date")
    student = factory.SubFactory(StudentUserFactory)
    tour = factory.SubFactory(TourFactory)
    comment = factory.Faker("sentence")

    class Meta:
        model = Schedule
