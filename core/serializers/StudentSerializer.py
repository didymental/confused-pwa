from rest_framework import serializers
from rest_framework_bulk import (
    BulkSerializerMixin,
    BulkListSerializer
)
from ..models.Student import Student


class StudentSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        list_serializer_class = BulkListSerializer
