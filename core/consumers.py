from typing import Optional


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
from core.models.UserProfile import UserProfile
from core.serializers.SessionSerializer import SessionSerializer
from core.serializers.StudentSerializer import StudentSerializer
from core.serializers.UserProfileSerializer import UserProfileSerializer


class ValidationError(Exception):
    pass


class RoomConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):

    room_subscribe: int

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
    def current_students(self, room: Session):
        return [
            StudentSerializer(student).data
            for student in Student.objects.filter(session_id=room)
        ]

    @database_sync_to_async
    def create_student(self, room: Session, display_name: str):
        Student.objects.create(session_id=room, display_name=display_name)

    @action()
    async def join_room(self, pk, display_name=None, **kwargs):
        session: Session = await self.get_room(pk=pk)

        if not session:
            await self.reply(
                action="join_room",
                errors=f"Session of id {pk} does not exist",
                status=404,
            )
            return
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

            await self.open_room(room=session, is_open=True)

            # FIXME: consumer is self?
            await self.student_change_handler.subscribe(
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
        room: Session = await self.get_room(self.room_subscribe)
        for group in self.groups:
            if not self.channel_layer:
                continue
            await self.channel_layer.group_send(
                group,
                {
                    "type": "update_joiners",
                    "instructor": await self.get_instructor(room=room),
                    "students": await self.current_students(room=room),
                },
            )

    @action()
    async def leave_room(self, pk, **kwargs):
        self.disconnect
        pass

    @model_observer(Student)
    async def student_change_handler(  # type: ignore
        self,
        message,
        action="",
        # observer=None,
        # subscribing_request_ids=[],
        **kwargs,
    ):
        await self.reply(data=message, action=action)

    @student_change_handler.groups_for_signal
    def student_change_handler(self, instance: Student, **kwargs):  # type: ignore
        yield f"session_id__{instance.session_id}"

    @student_change_handler.groups_for_consumer  # type: ignore
    def student_change_handler(self, room: Session, **kwargs):  # type: ignore
        if room is not None:
            yield f"session_id__{room}"

    @student_change_handler.serializer
    def student_change_handler(self, instance: Student, action, **kwargs):
        return dict(
            data=StudentSerializer(instance).data,
            action=action.value,
            pk=instance.pk,
        )
