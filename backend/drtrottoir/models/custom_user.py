from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models

from .building import Building
from .region import Region


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
        user.developer = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address', unique=True)
    is_active = models.BooleanField(default=True)
    developer = models.BooleanField(default=False)
    superuser = models.BooleanField(default=False)
    superstudent = models.BooleanField(default=False)
    first_name = models.CharField(verbose_name="first name", max_length=256, default='default')
    last_name = models.CharField(verbose_name="last name", max_length=256, default='default')
    region = models.ForeignKey(Region, verbose_name="address of the user", on_delete=models.SET_NULL, null=True)
    buildings = models.ManyToManyField(Building)

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
        return self.developer

    def has_module_perms(self, app_label):
        # For the dango admin panel
        return self.developer

    @property
    def is_super(self):
        # Is this a superuser, student or a developer
        return self.superstudent or self.superuser or self.developer

    @property
    def is_admin(self):
        # For the dango admin panel
        return self.developer

    @property
    def is_staff(self):
        # For the dango admin panel
        return self.developer
