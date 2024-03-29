from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.serializers import UserSerializer


class MeView(APIView):
    """
    Retrieve the user you are authenticated as. Authentication required.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
