from django.db import models


class Student(models.Model):
    """
    Defines the Student who will join a Session
    """

    session_id = models.ForeignKey("Session", on_delete=models.CASCADE)
    reaction_type_id = models.ForeignKey(
        "ReactionType", on_delete=models.PROTECT, null=True
    )
    display_name = models.CharField(max_length=120, null=False, blank=False)

    def __str__(self):
        return self.display_name
