from rest_framework import status
from rest_framework.test import APITestCase
from drtrottoir.models import BuildingInTour
from drtrottoir.tests.factories import (
    TourFactory, 
    BuildingFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.serializers import TourSerializer
from drtrottoir.models.custom_user import Roles


class TestTourAPIView(APITestCase):
    """ Test module for Tour API """

    def setUp(self):
        self.tour = TourFactory()
        self.building = BuildingFactory()
        self.region = self.building.region
        self.users = {
            Roles.DEVELOPER: DeveloperUserFactory(),
            Roles.SUPERADMIN: SuperAdminUserFactory(),
            Roles.SUPERSTUDENT: SuperStudentUserFactory(),
            Roles.OWNER: OwnerUserFactory(),
            Roles.STUDENT: StudentUserFactory()
        }
        # Superstudent should be able to edit tour
        self.client.force_authenticate(user=self.users[Roles.SUPERSTUDENT])

    def test_get(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(f'/api/tour/{self.tour.pk}/', follow=True)
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
        response4 = self.client.post('/api/tour/', data={"region": -1, "name": "test"}, follow=True)  # Region
        # should not exist in this case
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.post('/api/tour/', data={}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_from_existing(self):
        response = self.client.post('/api/tour/', data={"id": self.tour.pk}, follow=True)
        response2 = self.correct_add_DB(response)

        response_get = self.client.get(f'/api/tour/{self.tour.pk}/', follow=True)
        self.assertEqual(response_get.status_code, status.HTTP_200_OK)
        self.assertEqual(response_get.data["name"], response2.data["name"])
        self.assertEqual(response_get.data["region"], response2.data["region"])
        self.assertNotEqual(response_get.data["url"], response2.data["url"])

        response_fault = self.client.post('/api/tour/', data={"id": -1}, follow=True)  # tour should not exist
        self.assertEqual(response_fault.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete(self):
        self.client.delete(f'/api/tour/{self.tour.pk}/', follow=True)
        response = self.client.get(f'/api/tour/{self.tour.pk}/', follow=True)
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.delete(f'/api/tour/{self.tour.pk}/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        response = self.client.get(f'/api/tour/{self.tour.pk}/', follow=True)
        original = response.data
        response = self.client.put(f'/api/tour/{self.tour.pk}/',
                                   data={"region": response.data["region"], "name": "test"}, follow=True)
        new_data = response.data
        self.assertNotEqual(original["name"], new_data["name"])
        self.assertEqual(new_data["name"], "test")

    def test_update_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.put(f'/api/tour/{self.tour.pk}/', data={}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_buildings(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        build_tour = BuildingInTour.objects.create(tour=self.tour, building=self.building, order_index=0)
        response = self.client.get(f'/api/tour/{self.tour.pk}/buildings/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        buildings = response.data["buildings"]
        self.assertEqual(len(buildings), 1)
        self.assertEqual(buildings[0], self.building.id)
        found_build_tour = BuildingInTour.objects.get(building=buildings[0])
        self.assertEqual(found_build_tour.building, build_tour.building)
        self.assertEqual(found_build_tour.tour, build_tour.tour)
        self.assertEqual(found_build_tour.order_index, build_tour.order_index)

        BuildingInTour.objects.filter(pk=build_tour.pk).delete()
        response = self.client.get(f'/api/tour/{self.tour.pk}/buildings/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        buildings = response.data["buildings"]
        self.assertEqual(len(buildings), 0)
