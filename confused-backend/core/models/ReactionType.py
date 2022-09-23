from django.db import models


class ReactionType(models.Model):
    """
    Defines the Reaction that can be sent.
    """

    reaction_description = models.CharField(
        max_length=255, unique=True, blank=False, null=False
    )

    def __str__(self):
        return self.reaction_description
