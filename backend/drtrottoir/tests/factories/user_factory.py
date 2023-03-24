from factory.django import DjangoModelFactory
import factory

from drtrottoir.models import CustomUser
from drtrottoir.models.custom_user import Roles
from .region_factory import RegionFactory


class UserFactory(DjangoModelFactory):
    email = factory.Faker("email")
    is_active = True
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    region = factory.SubFactory(RegionFactory)

    class Meta:
        model = CustomUser


class DeveloperUserFactory(UserFactory):
    role = Roles.DEVELOPER


class SuperAdminUserFactory(UserFactory):
    role = Roles.SUPERADMIN


class SuperStudentUserFactory(UserFactory):
    role = Roles.SUPERSTUDENT


class OwnerUserFactory(UserFactory):
    role = Roles.OWNER    


class StudentUserFactory(UserFactory):
    role = Roles.STUDENT
