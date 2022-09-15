from rest_framework.viewsets import ModelViewSet
from ..models.User import User
from ..serializers.UserSerializer import UserSerializer


class SessionView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
