from django.db import models

from core.models.UserProfile import UserProfile


class Session(models.Model):
    """Session created by an instructor"""

    instructor = models.ForeignKey("UserProfile", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    is_open = models.BooleanField(default=False)

    def __str__(self):
        return self.name


# TODO: use this with custom authentication class
# TODO: remove model, use auth token for student session instead
class SessionToken(models.Model):
    """Token generated for a session"""

    session = models.OneToOneField(
        "Session",
        on_delete=models.CASCADE,
    )
