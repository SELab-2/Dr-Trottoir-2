from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Region
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import RegionSerializer


class RegionViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a region to be retrieved. Authentication required.

    list:
    API endpoint that allows all regions to be retrieved. Authentication required.

    create:
    API endpoint that allows a region to be created. Superstudent role or above required.

    update:
    API endpoint that allows a region to be updated. Superstudent role or above required.

    partial_update:
    API endpoint that allows a region to be updated. Superstudent role or above required.

    destroy:
    API endpoint that allows a region to be deleted. Superstudent role or above required.
    """

    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]

    class Meta:
        ordering = ['region_name']
