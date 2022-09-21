from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, generics, filters, status
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    RefreshToken,
)
from ..models import UserProfile
from ..serializers import UserProfileSerializer
from ..utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse


class UserSignUpView(generics.CreateAPIView):
    """Create a new company and owner in the system"""

    serializer_class = UserProfileSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        user = serializer.instance
        # token = TokenObtainPairSerializer.get_token(user=user)
        token = RefreshToken.for_user(user).access_token

        current_site = get_current_site(request=request).domain
        relative_link = reverse("email-verify")
        absurl = (
            "http://" + current_site + relative_link + "?token=" + str(token)
        )
        email_body = (
            "Hi "
            + user.username
            + " Use link below to verify your email address \n"
            + absurl
        )
        data = {
            "email_subject": "Verify your email",
            "email_body": email_body,
            "to_email": user.email,
        }
        Util.send_email(data)

        # serializer.data will serialize all the readable fields
        return Response(
            {**serializer.data, "refresh": str(token)},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class VerifyEmail(generics.GenericAPIView):
    def get(self):
        pass


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

    def get_queryset(self):
        return self.queryset.filter(email=self.request.user)
