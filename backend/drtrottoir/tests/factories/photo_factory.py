import random
from factory.django import DjangoModelFactory
import factory
from django.utils import timezone
from drtrottoir.models import Photo
from .visit_factory import VisitFactory


class PhotoFactory(DjangoModelFactory):
    visit = factory.SubFactory(VisitFactory)
    state = random.choice([0, 1, 2])
    comment = factory.Faker("sentence")
    created_at = factory.Faker("date_time", tzinfo=timezone.utc)

    class Meta:
        model = Photo
