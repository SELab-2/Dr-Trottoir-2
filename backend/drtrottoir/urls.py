from django.urls import path
from rest_framework import routers
from . import views
from drtrottoir.views import BuildingViewSet, RegionViewSet
from .views.tour_viewset import TourViewSet

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'region', RegionViewSet)
router.register(r'tour', TourViewSet)


urlpatterns = [
    path('user/auth/', views.user_auth, name='user_auth'),
]

urlpatterns += router.urls