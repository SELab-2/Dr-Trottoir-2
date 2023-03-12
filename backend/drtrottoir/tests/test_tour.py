from django.http import QueryDict
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from ..models import Tour
from drtrottoir.tests.tour_factory import TourFactory
from drtrottoir.tests.region_factory import RegionFactory
from drtrottoir.serializers.tour_serializer import TourSerializer
import json


class TestTourAPIView(APITestCase):
    """ Test module for Tour API """

    def setUp(self):
        self.tour = TourFactory()
        self.region = RegionFactory()

    def test_get(self):
        response = self.client.get('/api/tour/' + str(self.tour.pk), follow=True)
        serializer = TourSerializer(self.tour, context={'request': response.wsgi_request})
        self.assertEqual(serializer.data, response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post(self):
        response = self.client.post('/api/tour/', data={"region": self.region.pk, "name": "test"}, follow=True)
        self.assertTrue("tour" in response.data and "url" in response.data["tour"])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        url = response.data["tour"]["url"]
        response2 = self.client.get(url, follow=True)

        self.assertEqual(response2.data, response.data["tour"])
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        response3 = self.client.post('/api/tour/', data={}, follow=True)
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)
        response4 = self.client.post('/api/tour/', data={"region": 6548749, "name": "test"}, follow=True)  # Region
        # should not exist in this case
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_from_existing(self):
        response = self.client.post('/api/tour/', data={"id": self.tour.pk}, follow=True)
        self.assertTrue("tour" in response.data and "url" in response.data["tour"])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        url = response.data["tour"]["url"]
        response2 = self.client.get(url, follow=True)
        self.assertEqual(response2.data, response.data["tour"])
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        response_get = self.client.get('/api/tour/' + str(self.tour.pk), follow=True)
        self.assertEqual(response_get.status_code, status.HTTP_200_OK)
        self.assertEqual(response_get.data["name"], response2.data["name"])
        self.assertEqual(response_get.data["region"], response2.data["region"])
        self.assertNotEqual(response_get.data["url"], response2.data["url"])

        response_fault = self.client.post('/api/tour/', data={"id": 5648561}, follow=True)  # tour should not exist
        self.assertEqual(response_fault.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete(self):
        self.client.delete('/api/tour/' + str(self.tour.pk) + '/', follow=True)
        response = self.client.get('/api/tour/' + str(self.tour.pk) + '/', follow=True)
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_update(self):
        response = self.client.get('/api/tour/' + str(self.tour.pk), follow=True)
        original = response.data
        response = self.client.put('/api/tour/' + str(self.tour.pk) + '/',
                                   data={"region": response.data["region"], "name": "test"}, follow=True)
        new_data = response.data
        self.assertNotEqual(original["name"], new_data["name"])
        self.assertEqual(new_data["name"], "test")
