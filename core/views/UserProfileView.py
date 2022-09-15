from rest_framework.viewsets import ModelViewSet, GenericViewSet
from ..models import UserProfile
from ..serializers import UserProfileSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions, generics, filters, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


class UserSignUpView(generics.CreateAPIView):
    """Create a new company and owner in the system"""

    serializer_class = UserProfileSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        user = serializer.instance
        token, created = Token.objects.get_or_create(user=user)
        # serializer.data will serialize all the readable fields
        return Response(
            {
                **serializer.data,
                "token": token.key,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


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
