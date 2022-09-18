from typing import Dict, Optional, Type

from channels.db import database_sync_to_async
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin,
    action,
)

from core.models.Question import Question
from core.models.Session import Session
from core.models.Student import Student
from core.models.UserProfile import UserProfile
from core.serializers.SessionSerializer import SessionSerializer
from core.serializers.StudentSerializer import StudentSerializer
from core.serializers.UserProfileSerializer import UserProfileSerializer


class ValidationError(Exception):
    pass


class RoomConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):

    queryset = Session.objects.all()
    serializer_class: Type[SessionSerializer] = SessionSerializer
    lookup_field: str = "pk"
    room_subscribe: Optional[int] = None
    temp_user: Optional[Student] = None

    @database_sync_to_async
    def get_room(self, pk: int) -> Optional[Session]:
        if not Session.objects.filter(pk=pk).exists():
            return None
        return Session.objects.get(pk=pk)

    @database_sync_to_async
    def open_room(self, room: Session):
        room.is_open = True
        room.save()

    @database_sync_to_async
    def close_room(self, room: Session):
        room.is_open = False
        room.save()

    @database_sync_to_async
    def get_instructor(self, room: Session):
        return UserProfileSerializer(room.instructor).data

    @database_sync_to_async
    def get_current_students(self, room: Session):
        return [
            StudentSerializer(student).data
            for student in Student.objects.filter(session=room)
        ]

    @database_sync_to_async
    def create_student(self, room: Session, display_name: str):
        Student.objects.create(session=room, display_name=display_name)

    @database_sync_to_async
    def delete_student(self, student: Student):
        student.delete()

    async def disconnect(self, code):
        # TODO: invoke action as normal func?
        await self._leave_room(silent=True)
        return await super().disconnect(code)

    @action()
    async def leave_room(self, **kwargs):
        await self._leave_room(silent=False)

    async def _leave_room(self, silent=False, **kwargs):

        if self.room_subscribe is None:
            if silent:
                return
            return await self.reply(
                action="leave_room",
                errors="You have not joined a session yet",
                status=405,
            )

        session: Session = await self.get_room(pk=self.room_subscribe)

        if session is None:
            if silent:
                return
            return await self.reply(
                action="leave_room",
                errors="The session no longer exists",
                status=404,
            )

        try:
            user = self.scope["user"]
            if user:
                await self.instructor_leave_room(room=session, user=user)
            elif self.temp_user is not None:
                await self.student_leave_room(student=self.temp_user)
                self.temp_user = None

            await self.handle_student_change.unsubscribe(
                room=session, consumer=self
            )

            await self.handle_session_change.unsubscribe(
                room=session, consumer=self
            )

            if self.channel_layer:
                await self.channel_layer.group_discard(
                    self.room_subscribe, self.channel_name
                )

            await self.notify_joiners()

            self.room_subscribe = None

        except ValidationError as e:
            if silent:
                return
            await self.reply(**e.args[0])

    async def instructor_leave_room(self, room: Session, user: UserProfile):
        if room.instructor != user:
            raise ValidationError(
                {
                    "action": "leave_room",
                    "errors": "This session does not belong to you",
                    "status": 403,
                }
            )

        await self.close_room(room=room)

    async def student_leave_room(self, student: Student):
        await self.delete_student(student=student)

    @action()
    async def join_room(self, pk, display_name=None, **kwargs):
        session: Session = await self.get_room(pk=pk)

        if session is None:
            return await self.reply(
                action="join_room",
                errors=f"Session of id {pk} does not exist",
                status=404,
            )

        try:
            user = self.scope["user"]
            if user:
                await self.instructor_join_room(room=session, user=user)
            else:
                if not display_name:
                    raise ValidationError("Display name cannot be empty")
                await self.student_join_room(
                    room=session, display_name=display_name
                )

            await self.handle_student_change.subscribe(
                room=session, consumer=self
            )

            await self.handle_session_change.subscribe(
                room=session, consumer=self
            )

            if self.channel_layer:
                await self.channel_layer.group_add(
                    self.room_subscribe, self.channel_name
                )

            await self.notify_joiners()

            self.room_subscribe = pk

        except ValidationError as e:
            await self.reply(**e.args[0])

    async def instructor_join_room(self, room: Session, user: UserProfile):
        if room.instructor != user:
            raise ValidationError(
                {
                    "action": "join_room",
                    "errors": "This session does not belong to you",
                    "status": 403,
                }
            )

        await self.open_room(room=room)

    async def student_join_room(self, room: Session, display_name: str):
        if not room.is_open:
            raise ValidationError(
                {
                    "action": "join_room",
                    "errors": "This session is currently closed",
                    "status": 403,
                }
            )

        await self.create_student(room=room, display_name=display_name)

    async def notify_joiners(self):
        if self.room_subscribe is None:
            return
        room: Session = await self.get_room(pk=self.room_subscribe)
        for group in self.groups:
            if self.channel_layer is None:
                continue
            await self.channel_layer.group_send(
                group,
                {
                    "type": "update_joiners",
                    "instructor": await self.get_instructor(room=room),
                    "students": await self.get_current_students(room=room),
                },
            )

    # TODO: does it work if name differently
    @model_observer(Student)
    async def handle_student_change(  # type: ignore
        self,
        message: Dict,
        action="",
        # observer=None,
        # subscribing_request_ids=[],
        **kwargs,
    ):
        await self.reply(data=message, action=action)

    @handle_student_change.groups_for_signal
    def handle_student_change(self, instance: Student, **kwargs):  # type: ignore
        yield f"session__{instance.session}"

    @handle_student_change.groups_for_consumer  # type: ignore
    def handle_student_change(self, room: Session, **kwargs):  # type: ignore
        # if room is not None:
        yield f"session__{room}"

    @handle_student_change.serializer
    def handle_student_change(self, instance: Student, action, **kwargs):
        return dict(
            data=StudentSerializer(instance).data,
            action=action.value,
            pk=instance.pk,
        )

    @model_observer(Session)
    async def handle_session_change(  # type: ignore
        self, message: Dict, group=None, action=None, **kwargs
    ):

        is_open: Optional[bool] = message.get("is_open")
        if not is_open:
            await self._leave_room(silent=True)

    @handle_session_change.groups
    def handle_session_change(self, room: Session, *args, **kwargs):
        yield f"pk__{room.pk}"
