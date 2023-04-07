from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import VisitSerializer, UserSerializer, BuildingInTourSerializer
from drtrottoir.tests.factories import (
    VisitFactory,
    BuildingInTourFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.models.custom_user import Roles


class TestVisitView(APITestCase):
    """ Test module for Visit API """

    def setUp(self):
        self.visit = VisitFactory()
        self.building_in_tour = BuildingInTourFactory()
        self.users = {
            Roles.DEVELOPER: DeveloperUserFactory(),
            Roles.SUPERADMIN: SuperAdminUserFactory(),
            Roles.SUPERSTUDENT: SuperStudentUserFactory(),
            Roles.OWNER: OwnerUserFactory(),
            Roles.STUDENT: StudentUserFactory()
        }
        self.client.force_authenticate(user=self.users[Roles.DEVELOPER])

    def test_get(self):
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}))
        serializer = VisitSerializer(self.visit, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue("url" in response.data and
                        "user" in response.data and
                        "user_data" in response.data and
                        "building_in_tour" in response.data and
                        "building_in_tour_data" in response.data and
                        "arrival" in response.data and
                        "comment" in response.data)

        user_data = response.data["user_data"]
        self.assertTrue("email" in user_data and
                        "first_name" in user_data and
                        "last_name" in user_data)

        building_in_tour_data = response.data["building_in_tour_data"]
        self.assertTrue("nickname" in building_in_tour_data and
                        "description" in building_in_tour_data and
                        "tour_name" in building_in_tour_data)

        response2 = self.client.get(reverse("visit-detail", kwargs={'pk': -1}))  # Visit object shouldn't exist
        self.assertEqual(response2.status_code, 404)
    
    def test_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete(self):
        self.client.delete(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_patch(self):
        response = self.client.get(reverse("visit-detail", kwargs={'pk': self.visit.pk}), follow=True)
        original = response.data
        response = self.client.patch(reverse("visit-detail", kwargs={'pk': self.visit.pk}),
                                     data={"comment": "UPDATE TEST"}, follow=True)
        new_data = response.data
        print(new_data)
        self.assertNotEqual(original["comment"], new_data["comment"])
        self.assertEqual(new_data["comment"], "UPDATE TEST")

    def test_post(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get("/api/building_in_tour/" + str(self.building_in_tour.pk) + "/", follow=True)
        serializerBuildTour = BuildingInTourSerializer(self.building_in_tour,
                                                       context={'request': response.wsgi_request})
        serializerUser = UserSerializer(self.users[Roles.STUDENT], context={'request': response.wsgi_request})
        response = self.client.post("/api/visit/",
                                    data={"comment": "TEST",
                                          "arrival": "2023-03-15T17:10:46Z",
                                          "building_in_tour": serializerBuildTour.data["url"],
                                          "user": serializerUser.data["url"]
                                          }, follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(response.data["url"], follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test incorrect POST body
        response = self.client.post("/api/visit/",
                                    data={"comment": "TEST",
                                          "arrival": "2023-03-15T17:10:46Z",
                                          "building_in_tour": 1,
                                          "user": "user"
                                          }, follow=True)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
