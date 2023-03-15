from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import WasteSerializer
from drtrottoir.tests.factories import WasteFactory, DeveloperUserFactory, BuildingFactory


class TestWasteView(APITestCase):
    """ Test module for Waste API """

    def setUp(self):
        self.waste = WasteFactory()
        self.building = BuildingFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("waste-detail", kwargs={'pk': self.waste.pk}))
        serializer = WasteSerializer(self.waste, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def correct_add_DB(self, response):
        self.assertTrue("waste" in response.data and "url" in response.data["waste"])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        url = response.data["waste"]["url"]
        response2 = self.client.get(url, follow=True)
        self.assertEqual(response2.data, response.data["waste"])
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        return response2

    def test_post(self):
        # Check post
        d = {"date": "2000-01-01", "waste_type": "spaghetticode", "building": self.building}
        r = self.client.post('/api/waste/', data=d, follow=True)
        self.correct_add_DB(r)

        # Check invalid data
        r = self.client.post('/api/waste/', data={}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        invalid_d = {"date": "2000-01-01", "waste_type": "spaghetticode", "building": -1}
        r = self.client.post('/api/waste/', data=invalid_d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        invalid_d = {"date": "vandaag", "waste_type": "spaghetticode", "building": self.building.pk}
        r = self.client.post('/api/waste/', data=invalid_d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put(self):
        r1 = self.client.get(f'/api/waste/{self.waste.pk}/', follow=True)
        original = r1.data
        d = {"date": "2000-01-01", "waste_type": "spaghetticode"}
        r2 = self.client.put(f'/api/waste/{self.waste.pk}/', data=d, follow=True)
        new_data = r2.data
        self.assertNotEqual(original["waste_type"], new_data["waste_type"])
        self.assertEqual(new_data["waste_type"], "spaghetticode")

    def test_delete(self):
        self.client.delete(f'/api/waste/{self.waste.pk}/', follow=True)
        r = self.client.get(f'/api/waste/{self.waste.pk}/', follow=True)
        self.assertEqual(r.data["detail"].code, "not_found")
