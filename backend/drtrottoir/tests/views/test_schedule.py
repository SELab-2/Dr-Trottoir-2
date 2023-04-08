from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import ScheduleSerializer, UserSerializer, TourSerializer
from drtrottoir.tests.factories import (
    ScheduleFactory,
    TourFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.models.custom_user import Roles


class TestScheduleView(APITestCase):
    """ Test module for Visit API """

    def setUp(self):
        self.schedule = ScheduleFactory()
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
        response = self.client.get(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ScheduleSerializer(self.schedule, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)

    def test_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post(self):
        response = self.client.get(f"/api/tour/{self.tour.pk}/", follow=True)
        serializerUser = UserSerializer(self.users[Roles.STUDENT],  context={'request': response.wsgi_request})
        serializerTour = TourSerializer(self.tour,  context={'request': response.wsgi_request})
        response = self.client.post("/api/schedule/",
                                    data={
                                        "date": "2000-01-01",
                                        "comment": "TEST",
                                        "tour": serializerTour.data["url"],
                                        "student": serializerUser.data["url"],
                                    }, follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["comment"], "TEST")

    def test_post_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.patch(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}), data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        response = self.client.patch(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}),
                                     data={"comment": "test"}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["comment"], "test")

    def test_update_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.patch(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}), data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        response = self.client.delete(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}), follow=True)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}), follow=True)
        self.assertEqual(response.data["detail"].code, "not_found")

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.delete(reverse("schedule-detail", kwargs={'pk': self.schedule.pk}), follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
