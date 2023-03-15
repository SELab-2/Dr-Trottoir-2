from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import WasteSerializer
from drtrottoir.tests.factories import WasteFactory, DeveloperUserFactory


class TestWasteView(APITestCase):
    """ Test module for GET single Waste API """

    def setUp(self):
        self.waste = WasteFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("waste-detail", kwargs={'pk': self.waste.pk}))
        serializer = WasteSerializer(self.waste, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
