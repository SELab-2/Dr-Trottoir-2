import random
from factory.django import DjangoModelFactory
import factory
from drtrottoir.models import Photo
from .visit_factory import VisitFactory


class PhotoFactory(DjangoModelFactory):
    image = factory.Faker("image_url")
    visit = factory.SubFactory(VisitFactory)
    state = random.choice([1, 2, 3])
    comment = factory.Faker("sentence")

    class Meta:
        model = Photo
