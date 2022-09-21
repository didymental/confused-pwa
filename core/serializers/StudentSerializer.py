from rest_framework import serializers
from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer
from ..models.Student import Student


class StudentSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "is_online",
            "display_name",
            "session",
            "reaction_type",
        ]
        read_only_fields = ("id", "is_online")
        list_serializer_class = BulkListSerializer
