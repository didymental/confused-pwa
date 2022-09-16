from rest_framework_bulk import BulkModelViewSet
from ..models.Student import Student
from ..serializers.StudentSerializer import StudentSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..pagination import StandardResultsSetPagination


class BaseBulkViewSet(BulkModelViewSet):
    """Represents the interface for the Bulk Viewset"""

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination
    ordering_fields = "__all__"
    ordering = ["-id"]

    def allow_bulk_destroy(self, qs, filtered):
        return False


class StudentView(BaseBulkViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    model = Student

    def get_queryset(self):
        """Returns students that has joined the session by the instructor."""
        return self.queryset.filter(session_id__instructor=self.request.user)
