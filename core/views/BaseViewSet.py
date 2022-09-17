from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from ..pagination import StandardResultsSetPagination
from rest_framework_bulk import BulkModelViewSet


class BaseViewSet(ModelViewSet):
    """Base viewset for a viewset that handles CRUDL requests"""

    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination
    ordering_fields = "__all__"
    ordering = ["-id"]


class BaseBulkViewSet(BulkModelViewSet):
    """Represents the interface for the Bulk Viewset"""

    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination
    ordering_fields = "__all__"
    ordering = ["-id"]
