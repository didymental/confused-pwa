from rest_framework import serializers
from ..models.ReactionType import ReactionType


class ReactionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReactionType
        fields = '__all__'
        read_only_fields = ['id', 'reaction_type_description']
