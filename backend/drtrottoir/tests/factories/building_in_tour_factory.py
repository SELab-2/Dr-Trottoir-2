import factory
from factory.django import DjangoModelFactory

from drtrottoir.models import BuildingInTour
from drtrottoir.tests.factories import BuildingFactory, TourFactory

class BuildingInTourFactory(DjangoModelFactory):
    building = factory.subFactory(BuildingFactory)
    tour = factory.subFactory(TourFactory)
    order_index = factory.Faker("pydecimal", positive=True)

    class Meta:
        model = BuildingInTour