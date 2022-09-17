from typing import cast, Dict
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from ..models.UserProfile import UserProfile
from ..models.UserProfile import UserManager


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializes a user profile object"""

    class Meta:
        model = UserProfile
        fields = ("id", "email", "name", "password")
        extra_kwargs = {
            "password": {
                "write_only": True,
                "style": {"input_type": "password"},
            }
        }

    def create(self, validated_data: Dict[str, str]):
        """Creates and returns a new user"""

        user_manager = cast(UserManager, UserProfile.objects)

        user = user_manager.create_instructor(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
        )

        return user
