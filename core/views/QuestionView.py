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
        result = []
        sessions = Session.objects.filter(instructor=self.request.user)
        students = Student.objects.all()

        # get all students
        students_in_session = []
        for student in students:
            if student.session_id in sessions:
                students_in_session.append(student)

        # get all questions
        for question in self.queryset:
            if question.student_id in students_in_session:
                result.append(question)

        return result
