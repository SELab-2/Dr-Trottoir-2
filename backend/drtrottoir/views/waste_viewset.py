from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Waste
from drtrottoir.permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import WasteSerializer


class WasteViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a waste to be retrieved. Authentication required.

    list:
    API endpoint that allows all wastes to be retrieved. Authentication required.

    create:
    API endpoint that allows a waste to be created. Superstudent role or above required.

    update:
    API endpoint that allows a waste to be updated. Superstudent role or above required.

    partial_update:
    API endpoint that allows a waste to be updated. Superstudent role or above required.

    destroy:
    API endpoint that allows a waste to be deleted. Superstudent role or above required.
    """
    queryset = Waste.objects.all()
    serializer_class = WasteSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
