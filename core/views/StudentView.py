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
        return self.queryset.filter(session_id__instructor=self.request.user)
