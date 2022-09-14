from django.db import models


class Session(models.Model):
    """Session created by an instructor"""

    instructor_id = models.ForeignKey("UserProfile", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    is_open = models.BooleanField(default=False)

    def __str__(self):
        return self.name


# TODO: use this with custom authentication class
class SessionToken(models.Model):
    """Token generated for a session"""

    session_id = models.OneToOneField(
        "Session",
        on_delete=models.CASCADE,
        # primary_key=True,
    )
