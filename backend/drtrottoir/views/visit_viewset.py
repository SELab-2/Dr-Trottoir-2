from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drtrottoir.models import Photo, Visit, VisitComment
from drtrottoir.permissions.user_permissions import AnyonePostSuperEditPermission
from drtrottoir.serializers import VisitSerializer, PhotoSerializer, VisitCommentSerializer


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
    permission_classes = [IsAuthenticated & AnyonePostSuperEditPermission]
    
    class Meta:
        ordering = ['id']

    @action(detail=True, methods=['get'])
    def photos(self, request, pk=None):
        """
        Get all photos inside a visit. Authentication required.
        """
        if pk is not None and Visit.objects.filter(pk=pk).exists():
            photos = Photo.objects.filter(visit=pk)
            return Response(PhotoSerializer(list(photos), many=True, context={'request': request}).data)
        else:
            return Response("Given visit doesn't exist.", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        # Check if visit id is valid
        if pk is None or not Visit.objects.filter(pk=pk).exists():
            return Response("Given visit does not exist.", status=status.HTTP_400_BAD_REQUEST)
        # Get visits corresponding with visit
        visitComments = VisitComment.objects.filter(visit=pk)
        return Response(VisitCommentSerializer(list(visitComments), many=True, context={'request': request}).data)
