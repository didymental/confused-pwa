from typing import Dict, cast
from wsgiref import validate
from core.models.session import Session
from rest_framework import serializers


from core import models


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializes a user profile object"""

    class Meta:
        model = models.UserProfile
        fields = ("id", "email", "name", "password")
        extra_kwargs = {
            "password": {
                "write_only": True,
                "style": {"input_type": "password"},
            }
        }

    def create(self, validated_data: Dict[str, str]):
        """Create and return a new user"""

        user_manager = cast(models.UserManager, models.UserProfile.objects)

        user = user_manager.create_instructor(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
        )

        return user


class SessionSerializer(serializers.Serializer):
    """Serializer a name field for testing our APIView"""

    # name = serializers.CharField(max_length=10)

    class Meta:
        model = Session
        fields = ("id", "instructor", "name", "is_open")
        read_only_fields = (
            "id",
            "instructor",
        )

    # def create(self, validated_data):
    #     """Create a new session for the request user"""
    #     session = super().create(validated_data)
    #     return session
