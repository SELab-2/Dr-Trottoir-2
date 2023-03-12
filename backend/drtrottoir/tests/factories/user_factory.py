from factory.django import DjangoModelFactory
import factory

from drtrottoir.models import CustomUser
from drtrottoir.tests.factories import RegionFactory


class DeveloperUserFactory(DjangoModelFactory):
    email = factory.Faker("email")
    is_active = True
    developer = True
    superuser = False
    superstudent = False
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    region = factory.SubFactory(RegionFactory)

    class Meta:
        model = CustomUser
