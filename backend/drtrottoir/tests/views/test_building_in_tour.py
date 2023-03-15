from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import BuildingInTourSerializer
from drtrottoir.tests.factories import BuildingInTourFactory, BuildingFactory, TourFactory, DeveloperUserFactory

class TestBuildingInTourView(APITestCase):
    """
    Test module for BuildingInTour API
    """

    def setUp(self):
        self.tour = TourFactory()
        self.building = BuildingFactory()
        self.buildingInTour = BuildingInTourFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("buildingintour-detail", kwargs={'pk': self.buildingInTour.pk}))
        serializer = BuildingInTourSerializer(self.buildingInTour, context={'request': response.wsgi_request})
        self.assertEqual(serializer.data, response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post(self):
        response = self.client.post('/api/building_in_tour/', data={"tour": self.tour.pk, "building": self.building.pk, "order_index": 1}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)