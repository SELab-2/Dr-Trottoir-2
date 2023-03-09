from django.test import TestCase
from ..models import Building


class FixturesTest(TestCase):
    fixtures = ['fixtures/init_data.json']

    # Testing if fixtures are correctly imported
    def test_data_available(self):
        building = Building.objects.get(pk=1)
        self.assertIsNotNone(building)
        self.assertTrue(building.name == "Academie")
