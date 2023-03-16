from .building_serializer import BuildingSerializer
from .building_partial import BuildingPartialSerializer
from .region_serializer import RegionSerializer
from .user_serializer import UserSerializer
from .tour_serializer import TourSerializer
from .building_in_tour_serializer import BuildingInTourSerializer
from .user_partial import UserPartialSerializer
from .visit_serializer import VisitSerializer
from .schedule_serializer import ScheduleSerializer
from .tour_partial import TourPartialSerializer
from .photo_serializer import PhotoSerializer
from .waste_serializer import WasteSerializer
from .waste_partial import WastePartialSerializer
from .register_serializer import RegisterSerializer
from .building_in_tour_partial import BuildingInTourPartialSerializer


__all__ = [
    BuildingSerializer,
    BuildingPartialSerializer,
    RegionSerializer,
    UserSerializer,
    UserPartialSerializer,
    VisitSerializer,
    ScheduleSerializer,
    RegisterSerializer,
    TourSerializer,
    BuildingInTourSerializer,
    PhotoSerializer,
    WasteSerializer,
    WastePartialSerializer,
    RegisterSerializer,
    TourSerializer,
    BuildingInTourSerializer,
    BuildingInTourPartialSerializer,
    TourPartialSerializer
]
