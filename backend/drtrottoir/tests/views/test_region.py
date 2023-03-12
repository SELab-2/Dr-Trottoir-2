from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.models import Region
from drtrottoir.serializers import RegionSerializer
from drtrottoir.tests.factories import RegionFactory, DeveloperUserFactory


class TestRegionAPIView(APITestCase):
    """ Test module for GET single Region API """

    def setUp(self):
        self.region = RegionFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("building-detail", kwargs={'pk': self.region.pk}))
        serializer = RegionSerializer(self.region)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
