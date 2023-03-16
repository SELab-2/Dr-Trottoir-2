from django.urls import reverse
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drtrottoir.models import Visit
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import VisitSerializer
from drtrottoir.models import Photo, Building
from drtrottoir.serializers import PhotoSerializer


class VisitViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a visit to be retrieved. Authentication required.

    list:
    API endpoint that allows all visits to be retrieved. Authentication required.

    create:
    API endpoint that allows a visit to be created. Superstudent role or above required.

    update:
    API endpoint that allows a visit to be updated. Superstudent role or above required.

    partial_update:
    API endpoint that allows a visit to be updated. Superstudent role or above required.

    destroy:
    API endpoint that allows a visit to be deleted. Superstudent role or above required.
    """

    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]

    @action(detail=True, methods=['get'])
    def photos(self, request, pk=None):
        """
        Get all photos inside a visit. Authentication required.
        """
        if pk is not None and Visit.objects.filter(pk=pk).exists():

            urls = []
            for photo in Photo.objects.filter(visit=pk):
                url = reverse('photo-detail', args=[photo.id])
                urls.append(request.build_absolute_uri(url))

            return Response({"photos": urls})
        else:
            return Response("Given visit doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
