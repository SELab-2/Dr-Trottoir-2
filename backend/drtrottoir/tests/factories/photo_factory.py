import random
from factory.django import DjangoModelFactory
import factory
from django.utils import timezone
from drtrottoir.models import Photo
from .visit_factory import VisitFactory


class PhotoFactory(DjangoModelFactory):
    image = factory.Faker("image_url")
    visit = factory.SubFactory(VisitFactory)
    state = random.choice([1, 2, 3])
    comment = factory.Faker("sentence")
    created_at = factory.Faker("date_time", tzinfo=timezone.utc)

    class Meta:
        model = Photo
