from .building_viewset import BuildingViewSet
from .region_viewset import RegionViewSet
from .tour_viewset import TourViewSet
from .building_in_tour_viewset import BuildingInTourViewSet
from .visit_viewset import VisitViewSet
from .user_viewset import UserViewSet
from .schedule_viewset import ScheduleViewSet

__all__ = [
    BuildingViewSet,
    RegionViewSet,
    VisitViewSet,
    UserViewSet,
    ScheduleViewSet,
    TourViewSet,
    BuildingInTourViewSet
]
