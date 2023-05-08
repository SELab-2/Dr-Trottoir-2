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
    RegionFactory
)
from drtrottoir.serializers import TourSerializer, RegionSerializer
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
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue("url" in response.data)
        url = response.data["url"]
        response2 = self.client.get(url, follow=True)
        self.assertEqual(response2.data, response.data)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        return response2

    def test_post(self):
        serializer_region = self.client.get(f'/api/region/{self.region.pk}', follow=True)
        r = self.client.post('/api/tour/', data={"region": serializer_region.data["url"], "name": "test"}, follow=True)
        self.correct_add_DB(r)

        r = self.client.post('/api/tour/', data={}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.post('/api/tour/', data={"region": -1, "name": "test"}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.post('/api/tour/', data={}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

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
        buildings = response.data
        self.assertEqual(len(buildings), 1)
        BuildingInTour.objects.filter(pk=build_tour.pk).delete()
        response = self.client.get(f'/api/tour/{self.tour.pk}/buildings/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        buildings = response.data
        self.assertEqual(len(buildings), 0)

    def test_post_from_existing(self):
        r = self.client.post(f'/api/tour/{self.tour.pk}/duplicate/', follow=True)
        r = self.correct_add_DB(r)
        self.assertEqual(self.tour.name, r.data["name"])
        serializer_region = RegionSerializer(self.tour.region, context={'request': r.wsgi_request})
        self.assertEqual(serializer_region.data["url"], r.data["region"])

        new_region = RegionSerializer(RegionFactory(), context={'request': r.wsgi_request}).data["url"]
        d = {"name": "TEST", "region": new_region}
        r = self.client.post(f'/api/tour/{self.tour.pk}/duplicate/', data=d, follow=True)
        r = self.correct_add_DB(r)
        self.assertEqual(d["name"], r.data["name"])
        self.assertEqual(d["region"], r.data["region"])

        # Check linked buildings
        b1 = self.client.get(f'/api/tour/{self.tour.pk}/buildings/', follow=True)
        self.assertEqual(b1.status_code, status.HTTP_200_OK)
        b2 = self.client.get(f'{r.data["url"]}buildings/', follow=True)
        self.assertEqual(b2.status_code, status.HTTP_200_OK)
        self.assertTrue(all(map(lambda x, y: x["building"] == y["building"], b1.data, b2.data)))

        # wrong region
        r = self.client.post(f'/api/tour/{self.tour.pk}/duplicate/', data={"region": -1}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
