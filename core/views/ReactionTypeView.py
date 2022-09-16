from rest_framework.viewsets import ModelViewSet
from ..models.ReactionType import ReactionType
from ..serializers.ReactionTypeSerializer import ReactionTypeSerializer


class ReactionTypeView(ModelViewSet):
    queryset = ReactionType.objects.all()
    serializer_class = ReactionTypeSerializer
