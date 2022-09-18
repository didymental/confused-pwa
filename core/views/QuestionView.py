from core.views.BaseViewSet import BaseViewSet
from ..models.Question import Question
from ..models.Session import Session
from ..models.Student import Student
from ..serializers.QuestionSerializer import QuestionSerializer


class QuestionView(BaseViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        """Returns questions that are asked in the session created by the instructor."""
        return self.queryset.filter(
            student__session__instructor=self.request.user
        )
