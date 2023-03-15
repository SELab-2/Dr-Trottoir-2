from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from drtrottoir.models import Building, Waste
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly
from drtrottoir.serializers import BuildingSerializer, WastePartialSerializer


class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]

    # Get waste schedule for building
    @action(detail=True, methods=['get'])
    def waste(self, request, pk=None):
        # Check if building id is valid
        if pk is not None and Building.objects.filter(pk=pk).exists():
            q_params = request.query_params
            q_param_keys = q_params.keys()
            params = [
                "date",
                "start",
                "end",
            ]

            # Catch unknown parameters
            unknown_params = list(filter(lambda x: x not in params, q_param_keys))
            if unknown_params:
                return Response(f"Unknown query params: {', '.join(unknown_params)}. Valid params: {params}", status=status.HTTP_400_BAD_REQUEST)

            if "date" in q_param_keys:
                # Catch wrong usage of date param
                if len(q_param_keys) > 1:
                    return Response("Can't combine 'date' parameter with another parameter", status=status.HTTP_400_BAD_REQUEST)

                try:
                    q = Waste.objects.filter(date=q_params["date"]).order_by('id')
                    # Return WastePartialSerializer
                    return Response(WastePartialSerializer(list(q), many=True, context={'request': request}).data)

                except: # Catch ivalid date
                    return Response("Invalid date: date must be of format (YYYY-MM-DD)", status=status.HTTP_400_BAD_REQUEST)

            # Start and End params
            try:
                # Adds date__gte field when start param is present and date__gte field when end param is present
                arg = {"date__gte" if k == "start" else "date__lte": q_params[k] for k in q_param_keys}
                q = Waste.objects.filter(**arg).order_by('id')
                # Return WastePartialSerializer
                return Response(WastePartialSerializer(list(q), many=True, context={'request': request}).data)

            except: # Catch ivalid dates
                return Response("Invalid date: date must be of format (YYYY-MM-DD)", status=status.HTTP_400_BAD_REQUEST)
                
        else:
            return Response("Given building doesn't exist.", status=status.HTTP_400_BAD_REQUEST)
