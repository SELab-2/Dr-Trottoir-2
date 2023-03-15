from rest_framework import status
from rest_framework.test import APITestCase
from drtrottoir.models import BuildingInTour
from drtrottoir.tests.factories import TourFactory, BuildingFactory, DeveloperUserFactory
from drtrottoir.serializers import TourSerializer


class TestTourAPIView(APITestCase):
    """ Test module for Tour API """

    def setUp(self):
        self.tour = TourFactory()
        self.building = BuildingFactory()
        self.region = self.building.region
        user = DeveloperUserFactory()
        self.client.force_login(user=user)

    def test_get(self):
        response = self.client.get('/api/tour/' + str(self.tour.pk), follow=True)
        serializer = TourSerializer(self.tour, context={'request': response.wsgi_request})
        self.assertEqual(serializer.data, response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def correct_add_DB(self, response):
        self.assertTrue("tour" in response.data and "url" in response.data["tour"])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        url = response.data["tour"]["url"]
        response2 = self.client.get(url, follow=True)
        self.assertEqual(response2.data, response.data["tour"])
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        return response2

    def test_post(self):
        response = self.client.post('/api/tour/', data={"region": self.region.pk, "name": "test"}, follow=True)
        self.correct_add_DB(response)

        response3 = self.client.post('/api/tour/', data={}, follow=True)
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)
        response4 = self.client.post('/api/tour/', data={"region": 6548749, "name": "test"}, follow=True)  # Region
        # should not exist in this case
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_from_existing(self):
        response = self.client.post('/api/tour/', data={"id": self.tour.pk}, follow=True)
        response2 = self.correct_add_DB(response)

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

    def test_buildings(self):
        build_tour = BuildingInTour.objects.create(tour=self.tour, building=self.building, order_index=0)
        response = self.client.get('/api/tour/' + str(self.tour.pk) + '/buildings/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        buildings = response.data["buildings"]
        self.assertEqual(len(buildings), 1)
        self.assertEqual(buildings[0], self.building.id)
        found_build_tour = BuildingInTour.objects.get(building=buildings[0])
        self.assertEqual(found_build_tour.building, build_tour.building)
        self.assertEqual(found_build_tour.tour, build_tour.tour)
        self.assertEqual(found_build_tour.order_index, build_tour.order_index)

        BuildingInTour.objects.filter(pk=build_tour.pk).delete()
        response = self.client.get('/api/tour/' + str(self.tour.pk) + '/buildings/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        buildings = response.data["buildings"]
        self.assertEqual(len(buildings), 0)
