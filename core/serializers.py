from typing import Dict, cast
from wsgiref import validate
from rest_framework import serializers


from core import models


class HelloSerializer(serializers.Serializer):
    """Serializer a name field for testing our APIView"""

    name = serializers.CharField(max_length=10)


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
