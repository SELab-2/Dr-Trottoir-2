from rest_framework import status, viewsets
# from rest_framework.decorators import detail_route
from drtrottoir.models import Tour, Region
from drtrottoir.serializers.tour_serializer import TourSerializer
from rest_framework.response import Response
from django.forms.models import model_to_dict
import json


class TourViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tours to be viewed or edited.
    """
    serializer_class = TourSerializer
    queryset = Tour.objects.all()

    def create(self, request):
        data = request.POST
        if Region.objects.filter(pk=data["region"]).exists():
            region = Region.objects.get(pk=data["region"])
            name = data["name"]
            serializer = self.get_serializer_class()
            tour = Tour.objects.create(region=region, name=name)
            ser = serializer(instance=tour, context={'request': request})
            return Response({'id': ser.data["id"]})
        else:
            return Response("given region doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
