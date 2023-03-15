import factory
from factory.django import DjangoModelFactory

from drtrottoir.models import BuildingInTour
from drtrottoir.tests.factories import BuildingFactory, TourFactory

class BuildingInTourFactory(DjangoModelFactory):
    building = factory.SubFactory(BuildingFactory)
    tour = factory.SubFactory(TourFactory)
    order_index = factory.Faker("pyint", min_value=0)

    class Meta:
        model = BuildingInTour