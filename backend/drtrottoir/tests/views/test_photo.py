from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from drtrottoir.serializers import PhotoSerializer, VisitSerializer
from drtrottoir.tests.factories import (
    PhotoFactory,
    DeveloperUserFactory,
    SuperAdminUserFactory,
    SuperStudentUserFactory,
    OwnerUserFactory,
    StudentUserFactory,
)
from drtrottoir.models.custom_user import Roles


class TestPhotoView(APITestCase):
    """ Test module for GET single Photo API """

    def setUp(self):
        self.photo = PhotoFactory()
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
        response = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk}))
        serializer = PhotoSerializer(self.photo, context={'request': response.wsgi_request})
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_fault(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk+1}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.get(f"/api/visit/{self.photo.visit.pk}/", follow=True)
        serializerVisit = VisitSerializer(self.photo.visit, context={'request': response.wsgi_request})
        # Create temp image
        image = Image.new('RGB', (100, 100))
        tmpfile = SimpleUploadedFile(name='test_image.jpg', content=b'')
        image.save(tmpfile)
        tmpfile.seek(0)

        response = self.client.post(
            '/api/photo/',
            format="multipart",
            data={"comment": "TEST",
                  "created_at": self.photo.created_at,
                  "state": self.photo.state,
                  "visit": serializerVisit.data["url"],
                  "image": tmpfile,
                  },
            follow=True
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["comment"], "TEST")

    def test_patch(self):
        response1 = self.client.patch(
            f'/api/photo/{self.photo.pk}/',
            content_type="application/x-www-form-urlencoded",
            data={"comment": "nieuwe zin"},
            follow=True
        )
        response2 = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk}))
        self.assertNotEqual(response1.data, self.photo)
        self.assertEqual(response1.data["comment"], response2.data["comment"])

    def test_patch_owned_photo(self):
        self.client.force_authenticate(user=self.photo.visit.user)
        self.test_patch()

    def test_patch_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.patch(f'/api/photo/{self.photo.pk}/',
                                     content_type="application/x-www-form-urlencoded", data={})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        response = self.client.delete(f'/api/photo/{self.photo.pk}/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(reverse("photo-detail", kwargs={'pk': self.photo.pk}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_owned_photo(self):
        self.client.force_authenticate(user=self.photo.visit.user)
        self.test_delete()

    def test_delete_unauthorized(self):
        self.client.force_authenticate(user=self.users[Roles.STUDENT])
        response = self.client.delete(f'/api/photo/{self.photo.pk}/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_fault(self):
        response = self.client.delete('/api/photo/', follow=True)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
