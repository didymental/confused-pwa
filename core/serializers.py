from typing import Dict, cast
from wsgiref import validate
from core.models.Session import Session
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
        """Creates and returns a new user"""

        user_manager = cast(models.UserManager, models.UserProfile.objects)

        user = user_manager.create_instructor(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
        )

        return user


class SessionSerializer(serializers.ModelSerializer):
    """Serializer a name field for testing our APIView"""

    class Meta:
        model = Session
        fields = ("id", "instructor", "name", "is_open")
        read_only_fields = ("id", "instructor", "is_open")
