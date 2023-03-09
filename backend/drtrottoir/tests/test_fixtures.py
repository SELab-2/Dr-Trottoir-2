from django.test import TestCase
from ..models import (
    CustomUser,
    Location,
    Building,
    Photo,
    Visit,
    Tour,
    Schedule,
    BuildingInTour
)


class FixturesTest(TestCase):
    fixtures = ['fixtures/init_data.json']

    def test_data_available(self):
        building = Building.objects.get(pk=1)
        print(building)
        self.assertIsNotNone(building)
        # A test that uses the fixtures.
