import json
from typing import Dict, Optional, Type

from channels.db import database_sync_to_async
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin,
    action,
)
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.models.Session import Session
from core.models.Student import Student
from core.models.UserProfile import UserProfile
from core.serializers.SessionSerializer import SessionSerializer
from core.serializers.StudentSerializer import StudentSerializer
from core.serializers.UserProfileSerializer import UserProfileSerializer


class ValidationError(Exception):
    pass


class SessionConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):

    queryset = Session.objects.all()
    serializer_class: Type[SessionSerializer] = SessionSerializer
    lookup_field: str = "pk"
    session_subscribe: Optional[int] = None
    temp_user: Optional[Student] = None
    authentication_classes = (JWTAuthentication,)

    @database_sync_to_async
    def get_session(self, pk: int) -> Optional[Session]:
        if not Session.objects.filter(pk=pk).exists():
            return None
        return Session.objects.get(pk=pk)

    @database_sync_to_async
    def open_session(self, session: Session):
        session.is_open = True
        session.save()

    @database_sync_to_async
    def close_session(self, session: Session):
        session.is_open = False
        session.save()

    @database_sync_to_async
    def get_instructor(self, session: Session):
        return UserProfileSerializer(session.instructor).data

    @database_sync_to_async
    def get_current_students(self, session: Session):
        return [
            StudentSerializer(student).data
            for student in Student.objects.filter(session=session)
        ]

    @database_sync_to_async
    def create_student(self, session: Session, display_name: str):
        Student.objects.create(session=session, display_name=display_name)

    @database_sync_to_async
    def delete_student(self, student: Student):
        student.delete()

    @database_sync_to_async
    def get_user(self, session: Session):
        return session.instructor

    async def websocket_disconnect(self, message):
        print("kw websocket disconnect")
        await super().websocket_disconnect(message)

    # TODO: handle unexpected disconnection
    async def disconnect(self, code):
        await self._leave_session(silent=True)
        return await super().disconnect(code)

    @action()
    async def leave_session(self, **kwargs):
        await self._leave_session(silent=False)

    async def _leave_session(self, silent=False, **kwargs):

        if self.session_subscribe is None:
            if silent:
                return
            return await self.notify_failure(
                action="leave_session",
                errors="You have not joined a session yet",
                status=405,
            )

        session: Session = await self.get_session(pk=self.session_subscribe)

        if session is None:
            if silent:
                return
            return await self.notify_failure(
                action="leave_session",
                errors="The session no longer exists",
                status=404,
            )
        try:
            user: UserProfile = self.scope["user"]
            if user.is_authenticated:
                await self.instructor_leave_session(session=session, user=user)
            elif self.temp_user is not None:
                await self.student_leave_session(student=self.temp_user)
                self.temp_user = None

            await self.handle_student_change.unsubscribe(
                session=session, consumer=self
            )

            await self.handle_session_change.unsubscribe(
                session=session, consumer=self
            )

            await self.notify_joiners()

            if self.channel_layer:
                await self.channel_layer.group_discard(
                    self.session_subscribe, self.channel_name
                )

            self.session_subscribe = None

        except ValidationError as e:
            if silent:
                return
            await self.notify_failure(**e.args[0])

    async def instructor_leave_session(
        self, session: Session, user: UserProfile
    ):
        instructor = await self.get_user(session=session)
        if instructor != user:
            raise ValidationError(
                {
                    "action": "leave_session",
                    "errors": "This session does not belong to you",
                    "status": 403,
                }
            )

        await self.close_session(session=session)

    async def student_leave_session(self, student: Student):
        await self.delete_student(student=student)

    async def connect(self):
        await super().connect()
        await self.notify_success(
            action="connect",
            message="You are now connected!",
        )

    async def notify_success(self, action: str, message: str = ""):
        data = {
            "type": "success",
            "message": message,
        }

        return await self.reply(
            data=data,
            action=action,
            status=200,
        )

    async def notify_failure(
        self, action: str, errors: str, message: str = "", status=403
    ):
        data = {
            "type": "failed",
            "message": message,
        }

        return await self.reply(
            data=data,
            action=action,
            errors=errors,
            status=status,
        )

    @action()
    async def join_session(self, pk, display_name=None, **kwargs):
        session: Session = await self.get_session(pk=pk)

        if session is None:

            return await self.notify_failure(
                action="join_session",
                errors=f"Session of id {pk} does not exist",
                status=404,
            )

        try:
            user: UserProfile = self.scope["user"]

            if user.is_authenticated:
                await self.instructor_join_session(session=session, user=user)
            else:
                if not display_name:
                    raise ValidationError(
                        {
                            "action": "join_session",
                            "errors": "Display name cannot be empty",
                            "status": 403,
                        }
                    )
                await self.student_join_session(
                    session=session, display_name=display_name
                )

            await self.handle_student_change.subscribe(
                session=session, consumer=self
            )

            await self.handle_session_change.subscribe(
                session=session, consumer=self
            )

            self.session_subscribe = pk

            if self.channel_layer:
                await self.channel_layer.group_add(
                    str(self.session_subscribe), self.channel_name
                )

                print("kw channels", self.channel_layer.channels)
                print("kw groups", self.channel_layer.groups)

            await self.notify_joiners()

        except ValidationError as e:
            await self.notify_failure(**e.args[0])

    async def instructor_join_session(
        self, session: Session, user: UserProfile
    ):
        instructor = await self.get_user(session=session)
        if instructor != user:
            raise ValidationError(
                {
                    "action": "join_session",
                    "errors": "This session does not belong to you",
                    "status": 403,
                }
            )

        await self.open_session(session=session)

    async def student_join_session(self, session: Session, display_name: str):
        if not session.is_open:
            raise ValidationError(
                {
                    "action": "join_session",
                    "errors": "This session is currently closed",
                    "status": 403,
                }
            )

        await self.create_student(session=session, display_name=display_name)

    async def notify_joiners(self):
        if self.session_subscribe is None:
            return
        session: Session = await self.get_session(pk=self.session_subscribe)

        if self.channel_layer is not None:
            await self.channel_layer.group_send(
                str(self.session_subscribe),
                {
                    "type": "update_joiners",
                    "instructor": await self.get_instructor(session=session),
                    "students": await self.get_current_students(
                        session=session
                    ),
                },
            )

    async def update_joiners(self, event: dict):
        await self.send(text_data=json.dumps(event))

    # TODO: does it work if name differently
    @model_observer(Student)
    async def handle_student_change(  # type: ignore
        self,
        message: Dict,
        action="",
        **kwargs,
    ):
        await self.reply(data=message, action=action)

    @handle_student_change.groups_for_signal
    def handle_student_change(self, student: Optional[Student] = None, **kwargs):  # type: ignore
        if student:
            session: Session = student.session
            yield f"-session__{session.pk}"

    @handle_student_change.groups_for_consumer  # type: ignore
    def handle_student_change(self, session: Session, **kwargs):  # type: ignore
        yield f"-session__{session.pk}"

    @handle_student_change.serializer
    def handle_student_change(self, student: Student, action, **kwargs):
        return dict(
            data=StudentSerializer(student).data,
            action=action.value,
            pk=student.pk,
        )

    @model_observer(Session)
    async def handle_session_change(  # type: ignore
        self,
        message: Dict,
        action="",
        **kwargs,
    ):
        is_open: Optional[bool] = message.get("is_open")
        if not is_open:
            await self._leave_session(silent=True)

    # TODO: remove none check, debug later
    @handle_session_change.groups
    def handle_session_change(
        self, session: Optional[Session] = None, *args, **kwargs
    ):
        if session:
            yield f"-pk__{session.pk}"
