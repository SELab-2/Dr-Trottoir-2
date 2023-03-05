from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

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
        user.admin = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address', unique=True)
    is_active = models.BooleanField(default=True)
    admin = models.BooleanField(default=False) # a superuser

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
      verbose_name = 'User'
      verbose_name_plural = 'Users'

    def __str__(self):
            return self.email

    def has_perm(self, perm, obj=None):
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_admin(self):
        return self.admin

    @property
    def is_staff(self):
        return self.admin

# Building
class Building(models.Model):
    """
    Definition of a building: location where students have to
    """
    nickname = models.CharField("short name for building", max_length=255)
    address = models.CharField("building address", max_length=255)
    description = models.CharField("building description", max_length=4095)
