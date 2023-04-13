from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import WasteSerializer, BuildingSerializer
from drtrottoir.tests.factories import (
    WasteFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
    BuildingFactory,
)
from drtrottoir.models.custom_user import Roles


class TestWasteView(APITestCase):
    """ Test module for Waste API """

    def setUp(self):
        self.waste = WasteFactory()
        self.building = BuildingFactory()
        self.users = {
            Roles.DEVELOPER: DeveloperUserFactory(),
            Roles.SUPERADMIN: SuperAdminUserFactory(),
            Roles.SUPERSTUDENT: SuperStudentUserFactory(),
            Roles.OWNER: OwnerUserFactory(),
            Roles.STUDENT: StudentUserFactory()
        }
        self.client.force_authenticate(user=self.users[Roles.DEVELOPER])

    def test_get(self):
        # All users should have access
        for user in self.users.values():
            self.client.force_authenticate(user=user)
            response = self.client.get(reverse("waste-detail", kwargs={'pk': self.waste.pk}))
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            serializer = WasteSerializer(self.waste, context={'request': response.wsgi_request})
            self.assertEqual(response.data, serializer.data)

    def test_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("waste-detail", kwargs={'pk': self.waste.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        building_resp = self.client.get(f'/api/building/{self.building.pk}/', follow=True)
        building_url = building_resp.data["url"]
        d = {"date": "2000-01-01", "waste_type": "spaghetticode", "building": building_url}
        response = self.client.post('/api/waste/', data=d, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post(self):
        # Check post
        building_resp = self.client.get(f'/api/building/{self.building.pk}/', follow=True)
        building_url = building_resp.data["url"]
        d = {"date": "2000-01-01", "waste_type": "spaghetticode", "building": building_url, "action": "TEST"}
        r = self.client.post('/api/waste/', data=d, follow=True)

        # Check correct add db
        self.assertTrue("url" in r.data)
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        url = r.data["url"]
        r2 = self.client.get(url, follow=True)
        self.assertEqual(r2.data, r.data)
        self.assertEqual(r2.status_code, status.HTTP_200_OK)

        # Check invalid data
        r = self.client.post('/api/waste/', data={}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        invalid_d = {"date": "2000-01-01", "waste_type": "spaghetticode", "building": -1, "action": "TEST"}
        r = self.client.post('/api/waste/', data=invalid_d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        invalid_d = {"date": "vandaag", "waste_type": "spaghetticode", "building": building_url, "action": "TEST"}
        r = self.client.post('/api/waste/', data=invalid_d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put(self):
        r1 = self.client.get(f'/api/waste/{self.waste.pk}/', follow=True)
        original = r1.data
        building_resp = self.client.get(f'/api/building/{self.building.pk}/')
        building_url = building_resp.data["url"]
        d = {"date": "2000-01-01", "waste_type": "spaghetticode", "building": building_url, "action": "TEST"}
        r2 = self.client.put(f'/api/waste/{self.waste.pk}/', data=d, follow=True)
        new_data = r2.data
        self.assertNotEqual(original["waste_type"], new_data["waste_type"])
        self.assertEqual(new_data["waste_type"], "spaghetticode")

    def test_delete(self):
        r = self.client.delete(f'/api/waste/{self.waste.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        r = self.client.get(f'/api/waste/{self.waste.pk}/', follow=True)
        self.assertEqual(r.data["detail"].code, "not_found")
        # Building Should not be deleted
        response = self.client.get(reverse("building-detail", kwargs={'pk': self.building.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializerBuilding = BuildingSerializer(self.building, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializerBuilding.data)

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        r = self.client.delete(f'/api/waste/{self.waste.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)
