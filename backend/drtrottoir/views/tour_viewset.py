from rest_framework.decorators import action
from rest_framework import status, viewsets
from drtrottoir.models import Tour, Region, BuildingInTour
from drtrottoir.permissions import SuperPermissionOrReadOnly

from drtrottoir.serializers import TourSerializer, RegionSerializer, BuildingInTourPartialSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class TourViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a tour to be retrieved. Authentication required.

    list:
    API endpoint that allows all tours to be retrieved. Authentication required.

    create:
    API endpoint that allows a tour to be created. Superstudent role or above required.

    update:
    API endpoint that allows a tour to be updated. Superstudent role or above required.

    partial_update:
    API endpoint that allows a tour to be updated. Superstudent role or above required.

    destroy:
    API endpoint that allows a tour to be deleted. Superstudent role or above required.
    """

    serializer_class = TourSerializer
    queryset = Tour.objects.all()
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]

    def create(self, request, *args, **kwargs):
        data = request.data
        if 'id' in data:  # Create a new version of an existing tour
            if Tour.objects.filter(pk=data["id"]).exists():
                buildings_tour = BuildingInTour.objects.filter(tour=data["id"])
                tour = Tour.objects.get(pk=data["id"])
                name = tour.name
                region = tour.region
                new_tour = Tour.objects.create(region=region, name=name)
                for build_tour in buildings_tour:  # We will also copy all BuildingInTour objects
                    BuildingInTour.objects.create(tour=new_tour, building=build_tour.building,
                                                  order_index=build_tour.order_index)
                serializer = self.get_serializer_class()
                ser = serializer(instance=new_tour, context={'request': request})
                return Response({'tour': ser.data})
            else:
                return Response("Given tour doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
        elif "region" in data and "name" in data:  # Region must be the id
            if Region.objects.filter(pk=data["region"]).exists():
                region = Region.objects.get(pk=data["region"])
                reg_ser = RegionSerializer(instance=region, context={'request': request})
                name = data["name"]
                serializer = self.get_serializer_class()
                ser = serializer(data={"region": reg_ser.data["url"], "name": name}, context={'request': request})
                if ser.is_valid(raise_exception=True):
                    ser.save()
                    return Response({'tour': ser.data})
                else:

                    return Response("Given values are not valid", status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Given region doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Given values are not valid", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def buildings(self, request, pk=None):
        """
        Get all buildings inside a tour. Authentication required.
        """
        if pk is not None and Tour.objects.filter(pk=pk).exists():
            buildings_tour = BuildingInTour.objects.filter(tour=pk).order_by('order_index')
            return Response(BuildingInTourPartialSerializer(
                list(buildings_tour), many=True, context={'request': request}).data)
        else:
            return Response("Given tour doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
