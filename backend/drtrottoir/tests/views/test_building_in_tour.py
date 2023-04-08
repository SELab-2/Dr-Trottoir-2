from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import BuildingInTourSerializer, BuildingSerializer, TourSerializer
from drtrottoir.tests.factories import (
    BuildingInTourFactory,
    BuildingFactory,
    TourFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.models.custom_user import Roles


class TestBuildingInTourView(APITestCase):
    """ Test module for GET single Building API """

    def setUp(self):
        self.building_in_tour = BuildingInTourFactory()
        self.building = BuildingFactory()
        self.tour = TourFactory()
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
        response = self.client.get(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = BuildingInTourSerializer(self.building_in_tour, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)

    def test_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post(self):
        response = self.client.get(f"/api/building/{self.building.pk}/", follow=True)
        serializerBuilding = BuildingSerializer(self.building, context={'request': response.wsgi_request})
        serializerTour = TourSerializer(self.tour, context={'request': response.wsgi_request})
        response = self.client.post("/api/building_in_tour/", data={
            "tour": serializerTour.data["url"],
            "building": serializerBuilding.data["url"],
            "order_index": 10,
        }, follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["order_index"], 10)

    def test_post_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.post(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}),
                                    data={}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        response = self.client.patch(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}),
                                     data={"order_index": 10}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["order_index"], 10)

    def test_update_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.patch(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}), data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        response = self.client.delete(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}))
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.delete(reverse("buildingintour-detail", kwargs={'pk': self.building_in_tour.pk}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
