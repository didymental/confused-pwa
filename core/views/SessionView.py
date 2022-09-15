from ..models import Session
from ..serializers import SessionSerializer
from core.views.BaseViewSet import BaseViewSet
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..pagination import StandardResultsSetPagination


class SessionView(BaseViewSet):
    """Handles CRUDL of session"""

    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(instructor=user).distinct()

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
