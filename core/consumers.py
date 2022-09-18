from core.models.Question import Question
from core.models.Session import Session
from core.models.Student import Student
from core.serializers.SessionSerializer import SessionSerializer
from core.serializers.StudentSerializer import StudentSerializer
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
import json
from channels.db import database_sync_to_async
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin,
    action,
)


"""
observe list of reactions; 
observe list of questions; 
define the scope; filter the reactions and questions;

"""


class RoomConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    pass
