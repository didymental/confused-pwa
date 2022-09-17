from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from ..pagination import StandardResultsSetPagination


class BaseViewSet(ModelViewSet):
    """Base viewset for a viewset that handles CRUDL requests"""

    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination
    ordering_fields = "__all__"
    ordering = ["-id"]
