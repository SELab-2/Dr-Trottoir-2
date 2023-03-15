from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from drtrottoir.models import CustomUser
from drtrottoir.serializers import RegisterSerializer


class RegisterView(CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
