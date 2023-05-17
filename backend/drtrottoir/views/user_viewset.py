from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from drtrottoir.models import CustomUser
from drtrottoir.permissions.user_permissions import UserViewSetPermission, SuperPermission
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
    queryset = CustomUser.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated & UserViewSetPermission]

    # Marks user as removed
    @action(detail=True, methods=['post'])
    def remove(self, request, pk=None):
        # Check if user id is valid
        if pk is None or not CustomUser.objects.filter(pk=pk).exists():
            return Response("Given user doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.get(pk=pk)
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_200_OK)

    # Marks user as active
    @action(detail=True, methods=['post'], permission_classes=[SuperPermission])
    def activate(self, request, pk=None):
        # Check if user id is valid
        if pk is None or not CustomUser.objects.filter(pk=pk).exists():
            return Response("Given user doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.get(pk=pk)
        user.is_active = True
        user.save()
        return Response(status=status.HTTP_200_OK)

    # Returns inactive users
    @action(detail=False, methods=['get'], permission_classes=[SuperPermission])
    def inactive(self, request):
        users = CustomUser.objects.filter(is_active=False)
        return Response(UserSerializer(list(users), many=True, context={'request': request}).data)

    # Returns active users
    @action(detail=False, methods=['get'], permission_classes=[SuperPermission])
    def active(self, request):
        users = CustomUser.objects.filter(is_active=True)
        return Response(UserSerializer(list(users), many=True, context={'request': request}).data)
