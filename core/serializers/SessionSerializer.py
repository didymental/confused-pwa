from rest_framework import serializers
from ..models.Session import Session


class SessionSerializer(serializers.ModelSerializer):
    """Serializer a name field for testing our APIView"""

    class Meta:
        model = Session
        fields = ("id", "instructor", "name", "is_open")
        read_only_fields = ("id", "instructor", "is_open")

