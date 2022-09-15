from rest_framework.viewsets import ModelViewSet
from ..models.Reaction import Reaction
from ..serializers.ReactionSerializer import ReactionSerializer


class ReactionView(ModelViewSet):
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer
