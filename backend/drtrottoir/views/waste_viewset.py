from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Waste
from drtrottoir.permissions.super_permission import SuperPermissionOrReadOnly
from drtrottoir.serializers import WasteSerializer


class WasteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows waste model to be viewed or edited.
    """
    queryset = Waste.objects.all()
    serializer_class = WasteSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
