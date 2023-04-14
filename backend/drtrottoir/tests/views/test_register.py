from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.models import CustomUser


class TestRegisterView(APITestCase):
    """ Test module for GET single Region API """

    def test_post(self):
        data = {
            "email": "test123@test123.com",
            "password": "testtest123",
            "password2": "testtest123",
            "first_name": "first",
            "last_name": "last"
        }
        response = self.client.post(reverse("auth_register"), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(email=data['email']).exists())
