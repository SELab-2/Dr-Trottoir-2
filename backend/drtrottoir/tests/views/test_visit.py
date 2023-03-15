from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import VisitSerializer, UserSerializer, BuildingInTourSerializer
from drtrottoir.tests.factories import VisitFactory, DeveloperUserFactory, BuildingInTourFactory


class TestVisitView(APITestCase):
    """ Test module for Visit API """

    def setUp(self):
        self.visit = VisitFactory()
        self.building_in_tour = BuildingInTourFactory
        self.user = DeveloperUserFactory()
        self.client.force_authenticate(user=self.user)

    def test_get(self):
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}))
        serializer = VisitSerializer(self.visit, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response2 = self.client.get(reverse("visit-detail", kwargs={'pk': 546465}))  # Visit object shouldn't exist
        self.assertEqual(response2.status_code, 404)

    def test_delete(self):
        self.client.delete(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_patch(self):
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        original = response.data
        response = self.client.patch(reverse("visit-detail", kwargs={'pk': self.visit.pk}), data={"comment": "UPDATE TEST"}, follow=True)
        new_data = response.data
        print(new_data)
        self.assertNotEqual(original["comment"], new_data["comment"])
        self.assertEqual(new_data["comment"], "UPDATE TEST")

    def test_post(self):
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        print(response.data)
        # serializer = BuildingInTourSerializer(self.building_in_tour, context={'request': response.wsgi_request})
        response = self.client.post(reverse("visit-detail"),
                                    data={"comment": "TEST",
                                          "arrival": "2023-03-15T17:10:46Z",

                                          }, follow=True)
