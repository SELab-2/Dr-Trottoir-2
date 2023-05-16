from factory.django import DjangoModelFactory
import factory
from django.utils import timezone
from drtrottoir.models import VisitComment, ScheduleComment, Comment
from .user_factory import SuperStudentUserFactory
from .visit_factory import VisitFactory
from .building_factory import BuildingFactory
from .schedule_factory import ScheduleFactory


class CommentFactory(DjangoModelFactory):
    user = factory.SubFactory(SuperStudentUserFactory)
    text = factory.Faker("sentence")
    created_at = factory.Faker("date_time", tzinfo=timezone.utc)

    class Meta:
        model = Comment
        abstract = True


class VisitCommentFactory(CommentFactory):
    visit = factory.SubFactory(VisitFactory)

    class Meta:
        model = VisitComment


class ScheduleCommentFactory(CommentFactory):
    building = factory.SubFactory(BuildingFactory)
    schedule = factory.SubFactory(ScheduleFactory)

    class Meta:
        model = ScheduleComment
