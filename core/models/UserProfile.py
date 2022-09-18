from typing import Any, List
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    """Manager for user"""

    def create_instructor(self, email: str, name: str, password: str):
        """Creates an instructor"""
        if not email:
            raise ValueError("Instructor must have an email address")

        email = self.normalize_email(email)
        user: UserProfile = self.model(email=email, name=name)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email: str, name: str, password: str):
        """Creates a superuser"""
        user = self.create_instructor(email, name, password)

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class UserProfile(AbstractBaseUser, PermissionsMixin):
    """Database model for user"""

    # TODO: fix any usage
    current_rooms: Any

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)

    # not crucial to our app
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: List[str] = ["name"]

    def get_full_name(self):
        """Retrieve full name of user"""
        return self.name

    def get_short_name(self):
        """Retrieve short name of user"""
        return self.name

    def __str__(self):
        """Return string representation of our user"""
        return self.email
