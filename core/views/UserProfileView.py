from rest_framework.viewsets import ModelViewSet
from ..models import UserProfile
from ..serializers import UserProfileSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions
from rest_framework import filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings


class UserProfileViewSet(ModelViewSet):
    """Handles creating and updating profiles"""

    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (filters.SearchFilter,)
    search_fields = (
        "name",
        "email",
    )


class UserLoginApiView(ObtainAuthToken):
    """Handles creating user authentication tokens"""

    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
