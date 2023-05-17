from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.models import CustomUser
from drtrottoir.tests.factories import (SuperStudentUserFactory)


class TestRegisterView(APITestCase):
    """ Test module for GET single Region API """

    def setUp(self):
        self.data = {
            "email": "test123@test123.com",
            "password": "testtest123",
            "password2": "testtest123",
            "first_name": "first",
            "last_name": "last",
            "phone": "0412345678"
        }

    def test_post(self):
        response = self.client.post(reverse("auth_register"), data=self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(email=self.data['email']).exists())
        user = CustomUser.objects.get(email=self.data['email'])
        self.assertEqual(user.first_name, self.data['first_name'])
        self.assertEqual(user.last_name, self.data['last_name'])
        self.assertEqual(user.phone, self.data['phone'])

    def test_activate(self):
        response = self.client.post(reverse("auth_register"), data=self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = CustomUser.objects.get(email=self.data['email'])
        self.assertFalse(user.is_active)

        self.client.force_authenticate(user=SuperStudentUserFactory())
        response = self.client.post(f'/api/user/{user.pk}/activate/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = CustomUser.objects.get(email=self.data['email'])
        self.assertTrue(user.is_active)
