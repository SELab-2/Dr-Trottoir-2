from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import BuildingInTourSerializer
from drtrottoir.tests.factories import BuildingInTourFactory, DeveloperUserFactory

class TestBuildingInTourView(APITestCase):
    """
    Test module for BuildingInTour API
    """

    def setUp(self):
        self.buildingInTour = BuildingInTourFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("buildingintour-detail", kwargs={'pk': self.buildingInTour.pk}))
        serializer = BuildingInTourSerializer(self.buildingInTour, context={'request': response.wsgi_request})
        self.assertEqual(serializer.data, response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

