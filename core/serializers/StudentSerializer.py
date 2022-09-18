from rest_framework import serializers
from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer
from ..models.Student import Student


class StudentSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "display_name", "session", "reaction_type_id"]
        read_only_fields = ("id",)
        list_serializer_class = BulkListSerializer
