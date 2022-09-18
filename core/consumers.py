import json

from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin,
    action,
)
from channels.db import database_sync_to_async

from core.models.Question import Question
from core.models.Session import Session
from core.models.Student import Student
from core.serializers.SessionSerializer import SessionSerializer
from core.serializers.StudentSerializer import StudentSerializer


class RoomConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    pass
