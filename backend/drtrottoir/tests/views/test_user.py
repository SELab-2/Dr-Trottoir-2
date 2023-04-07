from rest_framework import status
from rest_framework.test import APITestCase

from drtrottoir.serializers import UserSerializer
from drtrottoir.tests.factories import (
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.models.custom_user import Roles


class TestUserView(APITestCase):
    """ Test module for User API """

    def setUp(self):
        self.users = {
            Roles.DEVELOPER: DeveloperUserFactory(),
            Roles.SUPERADMIN: SuperAdminUserFactory(),
            Roles.SUPERSTUDENT: SuperStudentUserFactory(),
            Roles.OWNER: OwnerUserFactory(),
            Roles.STUDENT: StudentUserFactory()
        }
        self.client.force_authenticate(user=self.users[Roles.DEVELOPER])

    def test_get_superadmin(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERADMIN])
        response = self.client.get(f'/api/user/{self.users[Roles.STUDENT].pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = UserSerializer(self.users[Roles.STUDENT], context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)

    def test_get_user(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(f'/api/user/{self.users[Roles.STUDENT].pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = UserSerializer(self.users[Roles.STUDENT], context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)

    def test_get_user_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.OWNER])
        response = self.client.get(f'/api/user/{self.users[Roles.STUDENT].pk}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_index(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERADMIN])
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_index_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.OWNER])
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_index_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERADMIN])
        response = self.client.post('/api/user/', data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_superadmin_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERADMIN])
        d = {"first_name": "andere-naam"}
        response = self.client.post(f'/api/user/{self.users[Roles.STUDENT].pk}/', data=d, follow=True)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_post_user_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        d = {"first_name": "andere-naam"}
        response = self.client.post(f'/api/user/{self.users[Roles.STUDENT].pk}/', data=d, follow=True)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch_superadmin(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERADMIN])
        d = {"first_name": "andere-naam"}
        response = self.client.patch(f'/api/user/{self.users[Roles.STUDENT].pk}/', data=d, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "andere-naam")

    def test_patch_user_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        d = {"first_name": "andere-naam"}
        response = self.client.patch(f'/api/user/{self.users[Roles.STUDENT].pk}/', data=d, follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_superadmin(self):
        self.client.force_authenticate(user=self.users[Roles.SUPERADMIN])
        response = self.client.delete(f'/api/user/{self.users[Roles.STUDENT].pk}/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_user_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.OWNER])
        response = self.client.delete(f'/api/user/{self.users[Roles.STUDENT].pk}/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
