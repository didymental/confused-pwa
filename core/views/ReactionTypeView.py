from rest_framework.viewsets import ReadOnlyModelViewSet
from ..models.ReactionType import ReactionType
from ..serializers.ReactionTypeSerializer import ReactionTypeSerializer


class ReactionTypeView(ReadOnlyModelViewSet):
    queryset = ReactionType.objects.all()
    serializer_class = ReactionTypeSerializer
