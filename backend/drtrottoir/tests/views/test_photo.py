from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from drtrottoir.serializers import PhotoSerializer
from drtrottoir.tests.factories import PhotoFactory, DeveloperUserFactory


class TestPhotoView(APITestCase):
    """ Test module for GET single Photo API """

    def setUp(self):
        self.photo = PhotoFactory()
        user = DeveloperUserFactory()
        self.client.force_authenticate(user=user)

    def test_get(self):
        response = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk}))
        serializer = PhotoSerializer(self.photo, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_fault(self):
        response = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk+1}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete(self):
        response1 = self.client.delete('/api/photo/' + str(self.photo.pk) + "/", follow=True)
        response2 = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk}))
        self.assertEqual(response1.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response2.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_fault(self):
        response = self.client.delete('/api/photo/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch(self):
        response1 = self.client.patch(
            '/api/photo/' + str(self.photo.pk) + "/",
            data={"comment": "nieuwe zin"},
            follow=True
        )
        response2 = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk}))

        self.assertNotEqual(response1.data, self.photo)
        self.assertEqual(response1.data["comment"], response2.data["comment"])


