from rest_framework import serializers
from ..models.Question import Question


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["student", "question_content", "vote_count"]
        read_only_fields = ("id",)
