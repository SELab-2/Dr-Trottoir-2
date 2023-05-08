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

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        if not Tour.objects.filter(pk=pk).exists():
            return Response("Given tour doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
        old_tour = Tour.objects.get(pk=pk)
        d = request.data

        # create new tour
        name = d["name"] if "name" in d else old_tour.name
        region = old_tour.region
        if "region" in d:
            r = str(d["region"])
            regionpk = list(filter(lambda x: x, r.split("/")))[-1]  # extract pk
            if not (
                "region" in r and
                regionpk.isdigit() and
                Region.objects.filter(pk=int(regionpk)).exists()
            ):
                return Response("Given region is not valid (requires valid url)", status=status.HTTP_400_BAD_REQUEST)
            region = Region.objects.get(pk=int(regionpk))
        new_tour = Tour.objects.create(region=region, name=name)

        # copy all BuildinInTour objects
        buildings_in_tour = BuildingInTour.objects.filter(tour=pk)
        for b in buildings_in_tour:
            BuildingInTour.objects.create(tour=new_tour, building=b.building, order_index=b.order_index)

        return Response(TourSerializer(new_tour, context={'request': request}).data, status=status.HTTP_201_CREATED)

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
