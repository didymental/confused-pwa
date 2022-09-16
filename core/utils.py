from rest_framework import serializers


def is_all_unique(x, key):
    seen = set()
    for item in x:
        if item[key] in seen:
            return False
        seen.add(item[key])
    return True


def validate_bulk_reference_uniqueness(data, key):
    bulk = isinstance(data, list)
    if bulk and not is_all_unique(data, key):
        msg = "Duplicate reference not allowed"
        raise serializers.ValidationError(msg)
    return data
