from drtrottoir.models import Template
from rest_framework import serializers


class TemplateSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for email templates
    """
    class Meta:
        model = Template
        fields = '__all__'
