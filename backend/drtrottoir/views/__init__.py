from .building_viewset import BuildingViewSet
from .region_viewset import RegionViewSet
from .waste_viewset import WasteViewSet
from .tour_viewset import TourViewSet
from .building_in_tour_viewset import BuildingInTourViewSet
from .visit_viewset import VisitViewSet
from .user_viewset import UserViewSet
from .schedule_viewset import ScheduleViewSet
from .photo_viewset import PhotoViewSet
from .register_view import RegisterView
from .me_view import MeView
from .comment_viewset import VisitCommentViewSet, ScheduleCommentViewSet

__all__ = [
    BuildingViewSet,
    RegionViewSet,
    VisitViewSet,
    UserViewSet,
    ScheduleViewSet,
    PhotoViewSet,
    RegisterView,
    WasteViewSet,
    TourViewSet,
    BuildingInTourViewSet,
    RegisterView,
    MeView,
    VisitCommentViewSet,
    ScheduleCommentViewSet
]
