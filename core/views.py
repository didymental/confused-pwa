from django.shortcuts import render


from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from rest_framework import status
from rest_framework import permissions
from rest_framework import filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.permissions import IsAuthenticated


from core import models
from core import serializers
from .pagination import StandardResultsSetPagination


class BaseViewSet(viewsets.ModelViewSet):
    """Base viewset for a viewset that handles CRUDL requests"""

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination
    ordering_fields = "__all__"
    ordering = ["-id"]


class UserProfileViewSet(viewsets.ModelViewSet):
    """Handle creating and updating profiles"""

    serializer_class = serializers.UserProfileSerializer
    queryset = models.UserProfile.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (filters.SearchFilter,)
    search_fields = (
        "name",
        "email",
    )


class UserLoginApiView(ObtainAuthToken):
    """Handle creating user authentication tokens"""

    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
