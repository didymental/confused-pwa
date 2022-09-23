from django.db import models


# TODO: inherit Message
class Question(models.Model):
    """
    Defines the Question that the Student can send in a Session.
    """

    student = models.ForeignKey("Student", on_delete=models.CASCADE)
    vote_count = models.IntegerField(default=0)
    voted_by = models.ManyToManyField(
        "Student", blank=True, related_name="voted_question_set"
    )
    unvoted_by = models.ManyToManyField(
        "Student", blank=True, related_name="unvoted_question_set"
    )

    # no submitting empty questions
    question_content = models.TextField(null=False, blank=False)

    def __str__(self):
        return self.question_content
