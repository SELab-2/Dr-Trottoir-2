from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Photo
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import PhotoSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class PhotoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows photos to be viewed or edited.
    """

    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
