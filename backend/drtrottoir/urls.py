from django.urls import path
from django.views.generic import TemplateView
from rest_framework import routers
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from backend.settings import API_DOCS_TITLE, API_DOCS_DESCRIPTION
from .views import (
    BuildingViewSet,
    RegionViewSet,
    TourViewSet,
    BuildingInTourViewSet,
    VisitViewSet,
    UserViewSet,
    ScheduleViewSet,
    WasteViewSet,
    RegisterView,
    PhotoViewSet,
    MeView,
    TemplateViewSet
)

router = routers.DefaultRouter()
router.register(r'building', BuildingViewSet)
router.register(r'region', RegionViewSet)
router.register(r'tour', TourViewSet)
router.register(r'building_in_tour', BuildingInTourViewSet)
router.register(r'visit', VisitViewSet)
router.register(r'user', UserViewSet)
router.register(r'schedule', ScheduleViewSet)
router.register(r'photo', PhotoViewSet)
router.register(r'waste', WasteViewSet)
router.register(r'template', TemplateViewSet)

urlpatterns = [
    path('user/auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('user/me/', MeView.as_view(), name='me'),
    path('schema/', get_schema_view(title=API_DOCS_TITLE, description=API_DOCS_DESCRIPTION)),
    path('docs/', TemplateView.as_view(template_name='swagger-ui.html'), name='swagger-ui'),
]

urlpatterns += router.urls
