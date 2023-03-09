from django.urls import path
from rest_framework import routers
from . import views
from drtrottoir.views import BuildingViewSet, LocationViewSet

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'location', LocationViewSet)

urlpatterns = [
    path('auth/', views.login, name='login'),
]

urlpatterns += router.urls