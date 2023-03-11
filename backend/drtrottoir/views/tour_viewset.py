from rest_framework.decorators import action
from rest_framework import status, viewsets
# from rest_framework.decorators import detail_route
from drtrottoir.models import Tour, Region, BuildingInTour
from drtrottoir.serializers.tour_serializer import TourSerializer
from rest_framework.response import Response
from django.http import JsonResponse
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
        if 'id' in data:  # Create a new version of an existing tour
            if Tour.objects.filter(pk=data["id"]).exists():
                tour = Tour.objects.get(pk=data["id"])
                name = tour.name
                region = tour.region
                new_tour = Tour.objects.create(region=region, name=name)
                serializer = self.get_serializer_class()
                ser = serializer(instance=new_tour, context={'request': request})
                return Response({'id': ser.data["id"]})
            else:
                return Response("Given tour doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
        else:
            if Region.objects.filter(pk=data["region"]).exists():
                region = Region.objects.get(pk=data["region"])
                name = data["name"]
                serializer = self.get_serializer_class()
                tour = Tour.objects.create(region=region, name=name)
                ser = serializer(instance=tour, context={'request': request})
                return Response({'id': ser.data["id"]})
            else:
                return Response("Given region doesn't exist.", status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        if Tour.objects.filter(pk=pk).exists():
            data = request.POST
            instance = Tour.objects.get(id=pk)
            serializer = self.get_serializer_class()
            ser = serializer(instance, data={'name': data["name"], 'region': data["region"]},
                             context={'request': request})
            if ser.is_valid():
                ser.save()
                print(instance.name)
                return Response({'status': "success"})
            else:
                return Response("Given data was not valid", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Given tour doesn't exist.", status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        if pk is not None and Tour.objects.filter(pk=pk).exists():
            Tour.objects.filter(id=pk).delete()
            return Response({'status': "success"})
        else:
            return Response("Given tour doesn't exist.", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def buildings(self, request, pk=None):
        if pk is not None and Tour.objects.filter(pk=pk).exists():
            buildings_tour = BuildingInTour.objects.filter(tour=pk).order_by('order_index')
            buildings = []
            for build_tour in buildings_tour:
                buildings.append(build_tour.building.id)

            return Response({"buildings": buildings})
        else:
            return Response("Given tour doesn't exist.", status=status.HTTP_400_BAD_REQUEST)