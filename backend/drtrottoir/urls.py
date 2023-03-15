from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from .views import (
    BuildingViewSet,
    RegionViewSet,
    TourViewSet,
    BuildingInTourViewSet,
    VisitViewSet,
    UserViewSet,
    WasteViewSet,
    RegisterView,
    MeView,
)

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'region', RegionViewSet)
router.register(r'tour', TourViewSet)
router.register(r'building_in_tour', BuildingInTourViewSet)
router.register(r'visit', VisitViewSet)
router.register(r'user', UserViewSet)
router.register(r'waste', WasteViewSet)

urlpatterns = [
    path('user/auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('user/me/', MeView.as_view(), name='me'),
]

urlpatterns += router.urls
