from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Visit
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import VisitSerializer


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
