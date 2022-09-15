from rest_framework.viewsets import ModelViewSet
from ..models.Session import Session
from ..serializers.SessionSerializer import SessionSerializer


class SessionView(ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
