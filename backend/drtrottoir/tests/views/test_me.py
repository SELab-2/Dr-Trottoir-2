from rest_framework import status
from rest_framework.test import APITestCase

from drtrottoir.serializers import UserSerializer
from drtrottoir.tests.factories import StudentUserFactory


class TestMeView(APITestCase):
    """ Test module for GET me API """

    def setUp(self):
        self.user = StudentUserFactory()
        self.client.force_authenticate(user=self.user)

    def test_get(self):
        response = self.client.get('/api/user/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = UserSerializer(self.user, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
