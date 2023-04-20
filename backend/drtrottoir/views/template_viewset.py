from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.models import Template
from drtrottoir.permissions import SuperPermission
from drtrottoir.serializers import TemplateSerializer


class TemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows regions to be viewed or edited.
    """
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [IsAuthenticated & SuperPermission]
