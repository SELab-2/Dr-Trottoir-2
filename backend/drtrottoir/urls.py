from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import BuildingViewSet, RegionViewSet, VisitViewSet, UserViewSet, RegisterView

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'region', RegionViewSet)
router.register(r'visit', VisitViewSet)
router.register(r'user', UserViewSet)

urlpatterns = [
    path('user/auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/auth/register/', RegisterView.as_view(), name='auth_register'),
]

urlpatterns += router.urls
