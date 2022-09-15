from ..models import Session
from ..serializers import SessionSerializer
from ..views import BaseViewSet


class SessionView(BaseViewSet):
    """Handles CRUDL of session"""

    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(instructor=user).distinct()

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
