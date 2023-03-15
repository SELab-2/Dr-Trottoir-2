from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Visit
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import VisitSerializer


class VisitViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows visits to be viewed or edited.
    """

    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
