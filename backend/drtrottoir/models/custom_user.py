from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models

from .building import Building
from .region import Region


class Roles(models.IntegerChoices):
    DEVELOPER = 1
    SUPERADMIN = 2
    SUPERSTUDENT = 3
    OWNER = 4
    STUDENT = 5


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email)
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password
        )
        user.role = Roles.DEVELOPER
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address', unique=True)
    is_active = models.BooleanField(default=True)
    first_name = models.CharField(verbose_name="first name", max_length=256, default='default')
    last_name = models.CharField(verbose_name="last name", max_length=256, default='default')
    region = models.ForeignKey(Region, verbose_name="address of the user", on_delete=models.SET_NULL, null=True)
    role = models.IntegerField(choices=Roles.choices, default=Roles.STUDENT)
    buildings = models.ManyToManyField(Building, related_name='users')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'User {self.email}'

    def has_perm(self, perm, obj=None):
        # For the dango admin panel
        return self.role == Roles.DEVELOPER

    def has_module_perms(self, app_label):
        # For the dango admin panel
        return self.role == Roles.DEVELOPER

    @property
    def is_super(self):
        # Is this a superuser, student or a developer
        return self.role <= Roles.SUPERSTUDENT

    @property
    def is_admin(self):
        # For the dango admin panel
        return self.role == Roles.DEVELOPER

    @property
    def is_staff(self):
        # For the dango admin panel
        return self.role == Roles.DEVELOPER
