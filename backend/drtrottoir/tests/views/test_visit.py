from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import VisitSerializer, UserSerializer
from drtrottoir.tests.factories import VisitFactory, DeveloperUserFactory


class TestVisitView(APITestCase):
    """ Test module for Visit API """

    def setUp(self):
        self.visit = VisitFactory()
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

    def test_update(self):
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        original = response.data
        print(original["user"]["url"])
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        user_serializer = UserSerializer(self.user, context={'request': response.wsgi_request})
        response = self.client.put(reverse("visit-detail", kwargs={'pk': self.visit.pk}),
                                   data={"arrival": original["arrival"],
                                         "building_in_tour": original["building_in_tour"],
                                         "user": user_serializer.data,
                                         "comment": "UPDATE TEST"
                                         }, follow=True)
        new_data = response.data
        print(new_data)
        self.assertNotEqual(original["comment"], new_data["comment"])
        self.assertEqual(new_data["comment"], "UPDATE TEST")
