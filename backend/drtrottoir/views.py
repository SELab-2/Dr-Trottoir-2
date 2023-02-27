from django.shortcuts import render
from rest_framework import viewsets
from .models import Building
from .serializers import BuildingSerializer

class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = []
