from django.db import models


class Reaction(models.Model):
    """
    Defines the Reaction that the Student can send in a Session.
    """
    student_id = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE
    )

    reaction_type_id = models.ForeignKey(
        "ReactionType",
        on_delete=models.PROTECT
    )

    def __str__(self):
        return str(self.student_id) + ': ' + str(self.reaction_type_id)
