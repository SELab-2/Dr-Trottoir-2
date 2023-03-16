from factory.django import DjangoModelFactory
import factory
from drtrottoir.models import BuildingInTour
from .tour_factory import TourFactory
from .building_factory import BuildingFactory


class BuildingInTourFactory(DjangoModelFactory):
    order_index = factory.Faker('pyint', min_value=0, max_value=100)
    building = factory.SubFactory(BuildingFactory)
    tour = factory.SubFactory(TourFactory)

    class Meta:
        model = BuildingInTour
