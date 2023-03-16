from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from drtrottoir.models import CustomUser
from drtrottoir.permissions.user_permissions import AdminPermissionOrReadOnly
from drtrottoir.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a user to be retrieved. Authentication required.

    list:
    API endpoint that allows all users to be retrieved. Authentication required.

    create:
    API endpoint that allows a user to be created. Superadmin role or above required.

    update:
    API endpoint that allows a user to be updated. Superadmin role or above required.

    partial_update:
    API endpoint that allows a user to be updated. Superadmin role or above required.

    destroy:
    API endpoint that allows a user to be deleted. Superadmin role or above required.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated & AdminPermissionOrReadOnly]
