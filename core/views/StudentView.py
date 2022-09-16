from core.views.BaseViewSet import BaseViewSet
from ..models.Student import Student
from ..models.Session import Session
from ..views.SessionView import SessionView
from ..serializers.StudentSerializer import StudentSerializer


class StudentView(BaseViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        """Returns students that has joined the session by the instructor."""
        result = []
        sessions = Session.objects.filter(instructor=self.request.user)
        for student in self.queryset:
            if student.session_id in sessions:
                result.append(student)

        return result
