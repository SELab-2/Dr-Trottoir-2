from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import VisitSerializer
from drtrottoir.tests.factories import VisitFactory, DeveloperUserFactory


class TestVisitView(APITestCase):
    """ Test module for GET single Region API """

    def setUp(self):
        self.visit = VisitFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}))
        serializer = VisitSerializer(self.visit, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
