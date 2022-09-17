from django.db import models


# TODO: inherit Message
class Question(models.Model):
    """
    Defines the Question that the Student can send in a Session.
    """

    student_id = models.ForeignKey("Student", on_delete=models.CASCADE)
    vote_count = models.IntegerField(default=0)

    # no submitting empty questions
    question_content = models.CharField(
        max_length=255, null=False, blank=False
    )

    def __str__(self):
        return self.question_content
