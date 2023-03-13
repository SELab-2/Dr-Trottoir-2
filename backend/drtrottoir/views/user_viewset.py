from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from drtrottoir.models import CustomUser
from drtrottoir.permissions.super_permission import SuperPermissionOrReadOnly
from drtrottoir.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows regions to be viewed or edited.
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
