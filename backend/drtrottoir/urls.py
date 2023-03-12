from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import BuildingViewSet, RegionViewSet
from .views.tour_viewset import TourViewSet
from .views.building_in_tour_viewset import BuildingInTourViewSet

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'region', RegionViewSet)
router.register(r'tour', TourViewSet, basename='tour')
router.register(r'building_in_tour', BuildingInTourViewSet)

urlpatterns = [
    path('user/auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += router.urls