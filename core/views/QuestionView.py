from rest_framework.viewsets import ModelViewSet
from ..models.Question import Question
from ..serializers.QuestionSerializer import QuestionSerializer


class QuestionView(ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
