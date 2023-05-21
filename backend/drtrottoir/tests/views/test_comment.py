from rest_framework import status
from rest_framework.test import APITestCase

from drtrottoir.serializers import VisitCommentSerializer, ScheduleCommentSerializer
from drtrottoir.tests.factories import (
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
    VisitCommentFactory,
    ScheduleCommentFactory,
    VisitFactory,
    ScheduleFactory,
    BuildingFactory
)
from drtrottoir.models.custom_user import Roles


class TestVisitCommentView(APITestCase):
    """ Test module for Visit Comment API """

    def setUp(self):
        self.visitComment = VisitCommentFactory()
        self.visit = VisitFactory()
        self.users = {
            Roles.DEVELOPER: DeveloperUserFactory(),
            Roles.SUPERADMIN: SuperAdminUserFactory(),
            Roles.SUPERSTUDENT: SuperStudentUserFactory(),
            Roles.OWNER: OwnerUserFactory(),
            Roles.STUDENT: StudentUserFactory()
        }
        self.client.force_authenticate(user=self.users[Roles.DEVELOPER])

    def test_get(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(f'/api/visit_comment/{self.visitComment.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = VisitCommentSerializer(self.visitComment, context={'request': response.wsgi_request})
        # Created_at is random in faker factory
        self.assertEqual({i: response.data[i] for i in response.data if i != 'created_at'},
                         {i: serializer.data[i] for i in serializer.data if i != 'created_at'})

    def test_get_visit_endpoint(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(f'/api/visit/{self.visitComment.visit.pk}/comments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        serializer = VisitCommentSerializer(self.visitComment, context={'request': response.wsgi_request})
        # Created_at is random in faker factory
        self.assertEqual({i: response.data[0][i] for i in response.data[0] if i != 'created_at'},
                         {i: serializer.data[i] for i in serializer.data if i != 'created_at'})
        response = self.client.get(f'/api/visit/{-1}/comments/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        visit_resp = self.client.get(f'/api/visit/{self.visit.pk}/', follow=True)
        visit_url = visit_resp.data["url"]
        d = {"text": "blablabla", "visit": visit_url}
        r = self.client.post('/api/visit_comment/', data=d, follow=True)
        self.assertTrue("url" in r.data)
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

        # Check correct add db
        url = r.data["url"]
        r2 = self.client.get(url, follow=True)
        self.assertEqual(r2.data, r.data)
        self.assertEqual(r2.status_code, status.HTTP_200_OK)
        self.assertNotEqual(r2.data['created_at'], None)

    def test_post_invalid(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        visit_resp = self.client.get(f'/api/visit/{self.visit.pk}/', follow=True)
        visit_url = visit_resp.data["url"]
        d = {"text": "blablabla", "visit": visit_url}

        # Check invalid data
        r = self.client.post('/api/visit_comment/', data={"text": "blablabla"}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        invalid_d = {"text": "blablabla", "visit": -1}
        r = self.client.post('/api/visit_comment/', data={"text": invalid_d}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

        # Check invalid arguments
        user_resp = self.client.get(f'/api/user/{self.users[Roles.STUDENT].pk}/', follow=True)
        user_url = user_resp.data["url"]
        r = self.client.post('/api/visit_comment/', data={**d, "user": user_url}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.post('/api/visit_comment/', data={**d, "created_at": 0}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch(self):
        self.client.force_authenticate(user=self.visitComment.user)
        r = self.client.get(f'/api/visit_comment/{self.visitComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        original = r.data
        d = {"text": "updated text"}
        r = self.client.patch(f'/api/visit_comment/{self.visitComment.pk}/', data=d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        r = self.client.get(f'/api/visit_comment/{self.visitComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        new_data = r.data
        self.assertNotEqual(original["text"], new_data["text"])
        self.assertEqual(new_data["text"], d["text"])
        self.assertNotEqual(new_data["updated_at"], None)

    def test_patch_invalid(self):
        user_resp = self.client.get(f'/api/user/{self.users[Roles.STUDENT].pk}/', follow=True)
        user_url = user_resp.data["url"]
        self.client.force_authenticate(user=self.visitComment.user)
        r = self.client.get(f'/api/visit_comment/{self.visitComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        d = {"text": "updated text"}
        r = self.client.patch(f'/api/visit_comment/{self.visitComment.pk}/', data={**d, "user": user_url}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        visit_resp = self.client.get(f'/api/visit/{self.visit.pk}/', follow=True)
        visit_url = visit_resp.data["url"]
        r = self.client.patch(f'/api/visit_comment/{self.visitComment.pk}/',
                              data={**d, "visit": visit_url}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        d = {"text": "updated text"}
        r = self.client.patch(f'/api/visit_comment/{self.visitComment.pk}/', data=d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        r = self.client.delete(f'/api/visit_comment/{self.visitComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        r = self.client.get(f'/api/visit_comment/{self.visitComment.pk}/', follow=True)
        self.assertEqual(r.data["detail"].code, "not_found")

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        r = self.client.delete(f'/api/visit_comment/{self.visitComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)


class TestScheduleCommentView(APITestCase):
    """ Test module for Schedule Comment API """

    def setUp(self):
        self.scheduleComment = ScheduleCommentFactory()
        self.schedule = ScheduleFactory()
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
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(f'/api/schedule_comment/{self.scheduleComment.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ScheduleCommentSerializer(self.scheduleComment, context={'request': response.wsgi_request})
        # Created_at is random in faker factory
        self.assertEqual({i: response.data[i] for i in response.data if i != 'created_at'},
                         {i: serializer.data[i] for i in serializer.data if i != 'created_at'})

    def test_get_schedule_endpoint(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(f'/api/schedule/{self.scheduleComment.schedule.pk}/comments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        serializer = ScheduleCommentSerializer(self.scheduleComment, context={'request': response.wsgi_request})
        # Created_at is random in faker factory
        self.assertEqual({i: response.data[0][i] for i in response.data[0] if i != 'created_at'},
                         {i: serializer.data[i] for i in serializer.data if i != 'created_at'})
        response = self.client.get(f'/api/schedule/{-1}/comments/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERSTUDENT])
        schedule_resp = self.client.get(f'/api/schedule/{self.schedule.pk}/', follow=True)
        schedule_url = schedule_resp.data["url"]
        building_resp = self.client.get(f'/api/building/{self.building.pk}/', follow=True)
        building_url = building_resp.data["url"]
        d = {"text": "blablabla", "schedule": schedule_url, "building": building_url}
        r = self.client.post('/api/schedule_comment/', data=d, follow=True)
        self.assertTrue("url" in r.data)
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

        # Check correct add db
        url = r.data["url"]
        r2 = self.client.get(url, follow=True)
        self.assertEqual(r2.data, r.data)
        self.assertEqual(r2.status_code, status.HTTP_200_OK)
        self.assertNotEqual(r2.data['created_at'], None)

    def test_post_invalid(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERSTUDENT])
        schedule_resp = self.client.get(f'/api/schedule/{self.schedule.pk}/', follow=True)
        schedule_url = schedule_resp.data["url"]
        building_resp = self.client.get(f'/api/building/{self.building.pk}/', follow=True)
        building_url = building_resp.data["url"]
        d = {"text": "blablabla", "schedule": schedule_url, "building": building_url}

        # Check invalid data
        r = self.client.post('/api/schedule_comment/', data={"text": "blablabla"}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        invalid_d = {"text": "blablabla", "building": -1, "schedule": -1}
        r = self.client.post('/api/schedule_comment/', data={"text": invalid_d}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

        # Check invalid arguments
        self.client.force_authenticate(user=self.users[Roles.DEVELOPER])
        user_resp = self.client.get(f'/api/user/{self.users[Roles.STUDENT].pk}/', follow=True)
        user_url = user_resp.data["url"]
        self.client.force_authenticate(user=self.users[Roles.SUPERSTUDENT])
        r = self.client.post('/api/schedule_comment/', data={**d, "user": user_url}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        r = self.client.post('/api/schedule_comment/', data={**d, "created_at": 0}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch(self):
        self.client.force_authenticate(user=self.scheduleComment.user)
        r = self.client.get(f'/api/schedule_comment/{self.scheduleComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        original = r.data
        d = {"text": "updated text"}
        r = self.client.patch(f'/api/schedule_comment/{self.scheduleComment.pk}/', data=d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        r = self.client.get(f'/api/schedule_comment/{self.scheduleComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        new_data = r.data
        self.assertNotEqual(original["text"], new_data["text"])
        self.assertEqual(new_data["text"], d["text"])
        self.assertNotEqual(new_data["updated_at"], None)

    def test_patch_invalid(self):
        user_resp = self.client.get(f'/api/user/{self.users[Roles.STUDENT].pk}/', follow=True)
        user_url = user_resp.data["url"]
        self.client.force_authenticate(user=self.scheduleComment.user)
        r = self.client.get(f'/api/schedule_comment/{self.scheduleComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        d = {"text": "updated text"}
        r = self.client.patch(f'/api/schedule_comment/{self.scheduleComment.pk}/',
                              data={**d, "user": user_url}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        schedule_resp = self.client.get(f'/api/schedule/{self.schedule.pk}/', follow=True)
        schedule_url = schedule_resp.data["url"]
        r = self.client.patch(f'/api/schedule_comment/{self.scheduleComment.pk}/',
                              data={**d, "schedule": schedule_url}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        building_resp = self.client.get(f'/api/building/{self.building.pk}/', follow=True)
        building_url = building_resp.data["url"]
        r = self.client.patch(f'/api/schedule_comment/{self.scheduleComment.pk}/',
                              data={**d, "building": building_url}, follow=True)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        d = {"text": "updated text"}
        r = self.client.patch(f'/api/schedule_comment/{self.scheduleComment.pk}/', data=d, follow=True)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        r = self.client.delete(f'/api/schedule_comment/{self.scheduleComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        r = self.client.get(f'/api/schedule_comment/{self.scheduleComment.pk}/', follow=True)
        self.assertEqual(r.data["detail"].code, "not_found")

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        r = self.client.delete(f'/api/schedule_comment/{self.scheduleComment.pk}/', follow=True)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)
