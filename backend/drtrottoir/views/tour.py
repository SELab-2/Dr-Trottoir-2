from rest_framework import viewsets

from drtrottoir.models import Tour
from drtrottoir.serializers.tour_serializer import TourSerializer


class TourViewSet(viewsets.ViewSet):
    """
    API endpoint that allows tours to be viewed or edited.
    """
    serializer_class = TourSerializer
    queryset = Tour.objects.all()

    def list(self, request):
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

