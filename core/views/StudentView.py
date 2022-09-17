from rest_framework_bulk import BulkModelViewSet

from core.views.BaseViewSet import BaseBulkViewSet
from ..models.Student import Student
from ..serializers.StudentSerializer import StudentSerializer


class StudentView(BaseBulkViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    model = Student

    def get_queryset(self):
        """Returns students that has joined the session by the instructor."""
        return self.queryset.filter(session_id__instructor=self.request.user)

    def perform_bulk_update(self, serializer):
        return self.perform_update(serializer)

    def perform_bulk_create(self, serializer):
        return self.perform_create(serializer)

    def allow_bulk_destroy(self, qs, filtered):
        return False
