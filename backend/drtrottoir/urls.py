from django.urls import path
from rest_framework import routers
from . import views
from drtrottoir.views import BuildingViewSet, RegionViewSet

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'region', RegionViewSet)

urlpatterns = [
    path('user/auth/', views.user_auth, name='user_auth'),
]

urlpatterns += router.urls