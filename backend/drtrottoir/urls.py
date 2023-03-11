from django.urls import path, include
from rest_framework import routers
from . import views
from drtrottoir.views import BuildingViewSet, RegionViewSet
from .views.tour_viewset import TourViewSet

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'region', RegionViewSet)
router.register(r'tour', TourViewSet, basename='tour')

urlpatterns = [
    path('', include(router.urls)),
    path('user/auth/', views.user_auth, name='user_auth'),
    #path('tour/', include(router.urls)),
    #path('tour/<int:pk>/', include(router.urls)),
    #path('tour/<int:pk>/', TourViewSet.as_view({'post': 'make_from_existing_tour'}), name='tour_duplicate'),
]
