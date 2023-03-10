from rest_framework import viewsets
# from rest_framework.decorators import detail_route
from drtrottoir.models import Tour, Location
from drtrottoir.serializers.tour_serializer import TourSerializer
from rest_framework.response import Response
import json


class TourViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tours to be viewed or edited.
    """
    serializer_class = TourSerializer
    queryset = Tour.objects.all()

    def create(self, request):
        print(request.POST)
        data = request.POST
        print(data["location"])
        for x in Location.objects.all():
            print(x.id)
        location = Location.objects.get(pk=data["location"])
        print(location.city)
        name = data["name"]
        print(name)
        serializer = self.get_serializer_class()
        ser = serializer(data={"name": name, "version": 0, "location": location})
        if ser.is_valid():
            ser.save()
            print("valid")
        else:
            print(ser.errors)
        print("done")
        # query = self.get_queryset()
        # print(query)
