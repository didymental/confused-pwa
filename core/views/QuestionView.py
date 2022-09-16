from core.views.BaseViewSet import BaseViewSet
from ..models.Question import Question
from ..serializers.QuestionSerializer import QuestionSerializer


class QuestionView(BaseViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
