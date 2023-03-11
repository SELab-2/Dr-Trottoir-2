from django.urls import path
from drtrottoir.views import BuildingViewSet, LocationViewSet
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'location', LocationViewSet)

urlpatterns = [
    path('auth/', views.login, name='login'),
]

urlpatterns += router.urls
