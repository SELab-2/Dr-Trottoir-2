from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import BuildingSerializer, RegionSerializer
from drtrottoir.tests.factories import (
    BuildingFactory,
    RegionFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.models.custom_user import Roles


class TestBuildingView(APITestCase):
    """ Test module for GET single Building API """

    def setUp(self):
        self.building = BuildingFactory()
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
        response = self.client.get(reverse("building-detail", kwargs={'pk': self.building.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = BuildingSerializer(self.building, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)

    def test_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("building-detail", kwargs={'pk': self.building.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post(self):
        response = self.client.get(f"/api/region/{self.region.pk}/", follow=True)
        serializerRegion = RegionSerializer(self.region, context={'request': response.wsgi_request})
        response = self.client.post("/api/building/", data={
            "nickname": "TEST",
            "description": "TEST",
            "address_line_1": "TEST",
            "address_line_2": "TEST",
            "country": "TEST",
            "region": serializerRegion.data["url"],
            "owners": [],
        }, follow=True)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["nickname"], "TEST")

    def test_post_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.post(reverse("building-detail", kwargs={'pk': self.building.pk}), data={}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        response = self.client.patch(reverse("building-detail", kwargs={'pk': self.building.pk}),
                                     data={"nickname": "TEST"}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nickname"], "TEST")

    def test_update_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.patch(reverse("building-detail", kwargs={'pk': self.building.pk}), data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        response = self.client.delete(reverse("building-detail", kwargs={'pk': self.building.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(reverse("building-detail", kwargs={'pk': self.building.pk}))
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.delete(reverse("building-detail", kwargs={'pk': self.building.pk}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Test /building/{id}/waste?params endpoint
    def test_waste(self):
        self.client.force_authenticate(user=self.users[Roles.DEVELOPER])
        # Add waste schedule to building
        building_resp = self.client.get(f'/api/building/{self.building.pk}/', follow=True)
        building_url = building_resp.data["url"]
        data_past = {"date": "2000-01-01", "waste_type": "verleden test", "building": building_url}
        data_future = {"date": "2050-01-01", "waste_type": "toekomst test", "building": building_url}
        data_now = {"date": "2023-01-01", "waste_type": "heden test", "building": building_url}
        for d in (data_past, data_future, data_now):
            r = self.client.post('/api/waste/', data=d, follow=True)
            self.assertEqual(r.status_code, status.HTTP_201_CREATED)

        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        # Test endpoint
        r = self.client.get(f'/api/building/{self.building.pk}/waste', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 3)
        # Date param
        r = self.client.get(f'/api/building/{self.building.pk}/waste?date={data_now["date"]}', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 1)
        self.assertEqual(r.data[0]["waste_type"], data_now["waste_type"])
        r = self.client.get(f'/api/building/{self.building.pk}/waste?date=2023-01-02', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 0)
        # Start param
        r = self.client.get(f'/api/building/{self.building.pk}/waste?start={data_now["date"]}', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 2)
        self.assertFalse(data_past["waste_type"] in map(lambda x: x["waste_type"], r.data))
        # End param
        r = self.client.get(f'/api/building/{self.building.pk}/waste?end={data_now["date"]}', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 2)
        self.assertFalse(data_future["waste_type"] in map(lambda x: x["waste_type"], r.data))
        # Start and End param
        r = self.client.get(
            f'/api/building/{self.building.pk}/waste?start={data_now["date"]}&end={data_now["date"]}',
            follow=True
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 1)
        self.assertEqual(r.data[0]["waste_type"], data_now["waste_type"])
        # Wrong parameter use
        r = self.client.get(f'/api/building/{self.building.pk}/waste?notaparameter=0', follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.get(f'/api/building/{self.building.pk}/waste?date=0', follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.get(f'/api/building/{self.building.pk}/waste?date=0000-00-00', follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.get(f'/api/building/{self.building.pk}/waste?start=0000-00-00', follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.get(f'/api/building/{self.building.pk}/waste?end=0000-00-00', follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.get(
            f'/api/building/{self.building.pk}/waste?date={data_now["date"]}&start={data_past["date"]}',
            follow=True
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        # Wrong building id
        r = self.client.get('/api/building/-1/waste', follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
