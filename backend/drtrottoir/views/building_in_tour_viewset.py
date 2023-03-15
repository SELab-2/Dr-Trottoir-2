from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from drtrottoir.models import BuildingInTour
from drtrottoir.permissions.super_permission import SuperPermissionOrReadOnly
from drtrottoir.serializers import BuildingInTourSerializer
from rest_framework.response import Response

class BuildingInTourViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = BuildingInTour.objects.all()
    serializer_class = BuildingInTourSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
    
    def create(self, request):
        data = request.data
        serializer = self.get_serializer_class()

        new_building_in_tour = BuildingInTour.objects.create(tour=data["tour"], building=data["building"],
                                                  order_index=data["order_index"])
        ser = serializer(instance=new_building_in_tour, context={'request': request})
        return Response({'building_in_tour': ser.data})
    
    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):
        building_in_tour = BuildingInTour.objects.filter(pk=pk)
        if building_in_tour.exists():
            building_in_tour.delete()
            return Response(status=204)
        else:
            return Response({'message': 'The given building_in_tour does not exist'}, status=404)
            
