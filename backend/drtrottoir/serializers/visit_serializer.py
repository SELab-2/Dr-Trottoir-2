from rest_framework import serializers
from drtrottoir.models import Visit, CustomUser, BuildingInTour


class VisitSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for visits
    """

    user = serializers.HyperlinkedRelatedField(queryset=CustomUser.objects.all(), view_name='customuser-detail')
    user_data = serializers.SerializerMethodField()
    building_in_tour = serializers.HyperlinkedRelatedField(queryset=BuildingInTour.objects.all(),
                                                           view_name='buildingintour-detail')
    building_in_tour_data = serializers.SerializerMethodField()

    class Meta:
        model = Visit
        fields = '__all__'

    def get_user_data(self, obj):
        user = obj.user
        return {"email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
                }

    def get_building_in_tour_data(self, obj):
        building_in_tour = obj.building_in_tour
        tour = building_in_tour.tour
        building = building_in_tour.building
        return {"nickname": building.nickname,
                "description": building.description,
                "tour_name": tour.name
                }
