from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import BuildingSerializer
from drtrottoir.tests.factories import BuildingFactory, DeveloperUserFactory


class TestBuildingView(APITestCase):
    """ Test module for GET single Building API """

    def setUp(self):
        self.building = BuildingFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("building-detail", kwargs={'pk': self.building.pk}))
        serializer = BuildingSerializer(self.building, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
