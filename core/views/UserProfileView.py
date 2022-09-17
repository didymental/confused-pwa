from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, generics, filters, status
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from ..models import UserProfile
from ..serializers import UserProfileSerializer


class UserSignUpView(generics.CreateAPIView):
    """Create a new company and owner in the system"""

    serializer_class = UserProfileSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        user = serializer.instance
        token = TokenObtainPairSerializer.get_token(user=user)
        # serializer.data will serialize all the readable fields
        return Response(
            {**serializer.data, "refresh": str(token)},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class UserProfileViewSet(ModelViewSet):
    """Handles creating and updating profiles"""

    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (filters.SearchFilter,)
    search_fields = (
        "name",
        "email",
    )
