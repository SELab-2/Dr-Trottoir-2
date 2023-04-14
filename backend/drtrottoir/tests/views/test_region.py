from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import RegionSerializer
from drtrottoir.tests.factories import (
    RegionFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.models.custom_user import Roles


class TestRegionAPIView(APITestCase):
    """ Test module for GET single Region API """

    def setUp(self):
        self.region = RegionFactory()
        self.users = {
            Roles.DEVELOPER: DeveloperUserFactory(),
            Roles.SUPERADMIN: SuperAdminUserFactory(),
            Roles.SUPERSTUDENT: SuperStudentUserFactory(),
            Roles.OWNER: OwnerUserFactory(),
            Roles.STUDENT: StudentUserFactory()
        }
        self.client.force_authenticate(user=self.users[Roles.SUPERSTUDENT])

    def test_get(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(reverse("region-detail", kwargs={'pk': self.region.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = RegionSerializer(self.region, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)

    def test_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("region-detail", kwargs={'pk': self.region.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post(self):
        response = self.client.post("/api/region/", data={"region_name": "TEST"}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["region_name"], "TEST")

    def test_post_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.post("/api/region/", data={"region_name": "TEST"}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        response = self.client.patch(f"/api/region/{self.region.pk}/", data={"region_name": "TEST"}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse("region-detail", kwargs={'pk': self.region.pk}))
        self.assertEqual(response.data["region_name"], "TEST")

    def test_update_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.patch(f"/api/region/{self.region.pk}/", data={"region_name": "TEST"}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        response = self.client.delete(f"/api/region/{self.region.pk}/", follow=True)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(reverse("region-detail", kwargs={'pk': self.region.pk}))
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.delete(f"/api/region/{self.region.pk}/", follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
