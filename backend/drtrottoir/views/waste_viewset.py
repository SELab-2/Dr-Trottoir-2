from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drtrottoir.models import Waste
from drtrottoir.permissions import SuperStudentPermissionOrReadOnly
from drtrottoir.serializers import WasteSerializer


class WasteViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a waste to be retrieved. Authentication required.

    list:
    API endpoint that allows all wastes to be retrieved. Authentication required.

    create:
    API endpoint that allows a waste to be created. Superstudent role or above required.

    update:
    API endpoint that allows a waste to be updated. Superstudent role or above required.

    partial_update:
    API endpoint that allows a waste to be updated. Superstudent role or above required.

    destroy:
    API endpoint that allows a waste to be deleted. Superstudent role or above required.
    """
    queryset = Waste.objects.all()
    serializer_class = WasteSerializer
    permission_classes = [IsAuthenticated & SuperStudentPermissionOrReadOnly]

    def list(self, request):
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
            return Response(
                f"Unknown query params: {', '.join(unknown_params)}. Valid params: {params}",
                status=status.HTTP_400_BAD_REQUEST
            )

        if "date" in q_param_keys:
            # Catch wrong usage of date param
            if len(q_param_keys) > 1:
                return Response(
                    "Can't combine 'date' parameter with another parameter",
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                q = Waste.objects.filter(date=q_params["date"]).order_by('id')
                # Return WastePartialSerializer
                return Response(WasteSerializer(list(q), many=True, context={'request': request}).data)

            except Exception:  # Catch ivalid date
                return Response(
                    "Invalid date: date must be of format (YYYY-MM-DD)",
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Start and End params
        try:
            # Adds date__gte field when start param is present and date__gte field when end param is present
            arg = {"date__gte" if k == "start" else "date__lte": q_params[k] for k in q_param_keys}
            q = Waste.objects.filter(**arg).order_by('date')
            # Return WastePartialSerializer
            return Response(WasteSerializer(list(q), many=True, context={'request': request}).data)

        except Exception:  # Catch ivalid dates
            return Response(
                "Invalid date: date must be of format (YYYY-MM-DD)",
                status=status.HTTP_400_BAD_REQUEST
            )
