import json
from typing import Dict, List, Optional, Type

from django.core.exceptions import ObjectDoesNotExist
from django.db.models.query import QuerySet
from channels.db import database_sync_to_async
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin,
    action,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from core.models.Question import Question
from core.models.Session import Session
from core.models.Student import Student
from core.models.ReactionType import ReactionType
from core.models.UserProfile import UserProfile
from core.serializers.SessionSerializer import SessionSerializer
from core.serializers.StudentSerializer import StudentSerializer
from core.serializers.QuestionSerializer import QuestionSerializer
from core.serializers.UserProfileSerializer import UserProfileSerializer


class ValidationError(Exception):
    pass


class SessionConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):

    queryset = Session.objects.all()
    serializer_class: Type[SessionSerializer] = SessionSerializer
    lookup_field: str = "pk"
    session_subscribe: Optional[int] = None
    temp_user: Optional[int] = None
    authentication_classes = (JWTAuthentication,)

    @database_sync_to_async
    def get_session(self, pk: int) -> Optional[Session]:
        if not Session.objects.filter(pk=pk).exists():
            return None
        return Session.objects.get(pk=pk)

    @database_sync_to_async
    def get_student(self, pk: int) -> Optional[Student]:
        if not Student.objects.filter(pk=pk).exists():
            return None
        return Student.objects.get(pk=pk)

    @database_sync_to_async
    def update_student(
        self, student_pk: int, reaction_type_pk: Optional[int]
    ) -> Optional[Student]:
        student = Student.objects.get(pk=student_pk)
        try:
            reaction = ReactionType.objects.get(pk=reaction_type_pk)
            student.reaction_type = reaction

        except ObjectDoesNotExist:
            student.reaction_type = None

        student.save()

    @database_sync_to_async
    def open_session(self, session: Session):
        session.is_open = True
        session.save()

    @database_sync_to_async
    def empty_session(self, session: Session):
        students = Student.objects.filter(session=session)
        if not students.exists():
            return
        # students.delete()
        students.update(is_online=False)

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
            for student in Student.objects.filter(
                session=session, is_online=True
            ).order_by("-id")
        ]

    @database_sync_to_async
    def _get_question_session(self, question_pk: int) -> Optional[Session]:
        try:
            question = Question.objects.get(pk=question_pk)
            return question.student.session
        except ObjectDoesNotExist:
            return None

    @database_sync_to_async
    def get_current_questions(self):
        return [
            QuestionSerializer(question).data
            for question in Question.objects.filter(
                student__session__pk=self.session_subscribe
            ).order_by("-id")
        ]

    @database_sync_to_async
    def create_question(
        self, student_pk: int, question_content: str
    ) -> Optional[Question]:

        try:
            student = Student.objects.get(pk=student_pk)

            Question.objects.create(
                student=student,
                question_content=question_content,
            )
            print("kw question created")
        except ObjectDoesNotExist:
            return None

    @database_sync_to_async
    def update_question_vote(
        self, question_pk: int, increment: bool
    ) -> Optional[Question]:

        try:
            # TODO: double check?
            if self.temp_user is None:
                raise ValidationError(
                    {
                        "action": "update_question_vote",
                        "errors": ["You have not joined a session yet"],
                        "status": status.HTTP_403_FORBIDDEN,
                    }
                )

            question = Question.objects.get(pk=question_pk)
            # TODO: check if stu exists?
            student = Student.objects.get(id=self.temp_user)

            if increment:
                print("kw1")
                if not Question.objects.filter(
                    voted_by__id=self.temp_user
                ).exists():
                    question.vote_count += 1
                    question.voted_by.add(student)
                    question.unvoted_by.remove(student)
                    print("kw2 ")
                print("kw3")
            else:
                if not Question.objects.filter(
                    unvoted_by__id=self.temp_user
                ).exists():
                    question.vote_count -= 1
                    question.unvoted_by.add(student)
                    question.voted_by.remove(student)

            if question.vote_count < 0:
                raise ValidationError(
                    {
                        "action": "update_question_vote",
                        "errors": ["Vote count cannot be less than 0"],
                        "status": status.HTTP_403_FORBIDDEN,
                    }
                )
            question.save()

            print("vote updated")

        except ObjectDoesNotExist:
            raise ValidationError(
                {
                    "action": "update_question_vote",
                    "errors": ["Question not found"],
                    "status": status.HTTP_404_NOT_FOUND,
                }
            )

    @database_sync_to_async
    def create_student(self, session: Session, display_name: str):
        return Student.objects.create(
            session=session, display_name=display_name
        )

    @database_sync_to_async
    def remove_student(self, student: Student):
        # student.delete()
        student.is_online = False
        student.save()

    @database_sync_to_async
    def get_user(self, session: Session):
        return session.instructor

    async def websocket_disconnect(self, message):
        print("kw websocket disconnect")
        await super().websocket_disconnect(message)

    # TODO: handle unexpected disconnection
    async def disconnect(self, code):
        await self._leave_session(silent=False)
        return await super().disconnect(code)

    @action()
    async def leave_session(self, **kwargs):
        await self._leave_session(silent=False)

    async def _leave_session(self, silent=False, **kwargs):

        print("kw checkpoint0")
        if self.session_subscribe is None:
            if silent:
                return
            return await self.notify_failure(
                action="leave_session",
                errors=["You have not joined a session yet"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        session: Session = await self.get_session(pk=self.session_subscribe)
        print("kw checkpoint1")

        if session is None:
            if silent:
                return
            return await self.notify_failure(
                action="leave_session",
                errors=["The session no longer exists"],
                status=status.HTTP_404_NOT_FOUND,
            )

        print("kw checkpoint2")

        try:
            user: UserProfile = self.scope["user"]

            print("kw check user", user, self.temp_user)
            if user.is_authenticated:
                print("instructor leaving")
                await self.instructor_leave_session(session=session, user=user)
            elif self.temp_user is not None:
                print("student leaving")
                student = await self.get_student(pk=self.temp_user)
                await self.student_leave_session(student=student)

            print("kw leaving")

            if not silent:
                print("kw notify leaving")
                await self.notify_joiners()

            await self._leave_session_cleanup()

        except ValidationError as e:
            if silent:
                return
            await self.notify_failure(**e.args[0])

    async def _leave_session_cleanup(self):
        session: Session = await self.get_session(pk=self.session_subscribe)

        await self.handle_student_change.unsubscribe(
            session=session, consumer=self
        )

        await self.handle_session_change.unsubscribe(
            session=session, consumer=self
        )

        await self.handle_question_change.unsubscribe(
            session=session, consumer=self
        )

        if self.channel_layer:
            await self.channel_layer.group_discard(
                str(self.session_subscribe), self.channel_name
            )

        await self.notify_success(
            action="leave_session",
            message=f"You have left or been removed from session {self.session_subscribe}",
        )

        self.temp_user = None
        self.session_subscribe = None

    async def instructor_leave_session(
        self, session: Session, user: UserProfile
    ):
        instructor = await self.get_user(session=session)
        if instructor != user:
            raise ValidationError(
                {
                    "action": "leave_session",
                    "errors": ["This session does not belong to you"],
                    "status": status.HTTP_403_FORBIDDEN,
                }
            )

        print(
            "kw instructor close session",
        )

        await self.close_session(session=session)

    async def student_leave_session(self, student: Student):
        await self.remove_student(student=student)

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
            status=status.HTTP_200_OK,
        )

    async def notify_failure(
        self,
        action: str,
        errors: List[str],
        message: str = "",
        status=status.HTTP_403_FORBIDDEN,
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
                errors=[f"Session of id {pk} does not exist"],
                status=status.HTTP_404_NOT_FOUND,
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
                            "errors": ["Display name cannot be empty"],
                            "status": status.HTTP_403_FORBIDDEN,
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

            await self.handle_question_change.subscribe(
                session=session, consumer=self
            )

            print("kw subbed to session change")

            self.session_subscribe = pk

            if self.channel_layer:
                await self.channel_layer.group_add(
                    str(self.session_subscribe), self.channel_name
                )

                print("kw channels", self.channel_layer.channels)
                print("kw groups", self.channel_layer.groups)

            data = {
                "type": "success",
                "message": "You have successfully joined the session",
                "questions": await self.get_current_questions(),
            }

            await self.reply(
                data=data,
                action="join_session",
                status=status.HTTP_200_OK,
            )

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
                    "errors": ["This session does not belong to you"],
                    "status": status.HTTP_403_FORBIDDEN,
                }
            )

        await self.open_session(session=session)
        await self.empty_session(session=session)

    async def student_join_session(self, session: Session, display_name: str):
        if not session.is_open:
            raise ValidationError(
                {
                    "action": "join_session",
                    "errors": ["This session is currently closed"],
                    "status": status.HTTP_403_FORBIDDEN,
                }
            )

        if self.session_subscribe is not None:
            raise ValidationError(
                {
                    "action": "join_session",
                    "errors": [
                        "You have already joined a session. Please leave your current session first"
                    ],
                    "status": status.HTTP_403_FORBIDDEN,
                }
            )

        student = await self.create_student(
            session=session, display_name=display_name
        )
        self.temp_user = student.pk
        print("kw assigned temp user")

    async def notify_joiners(self):
        if self.session_subscribe is None:
            return

        session: Session = await self.get_session(pk=self.session_subscribe)

        if self.channel_layer is not None:
            await self.channel_layer.group_send(
                str(self.session_subscribe),
                {
                    "type": "update_joiners",
                    "session": SessionSerializer(session).data,
                    "students": await self.get_current_students(
                        session=session
                    ),
                },
            )

    async def update_joiners(self, event: dict):
        await self.reply(
            data=event,
            action="notify_joiners",
        )

    # TODO: does it work if name differently
    @model_observer(Student)
    async def handle_student_change(  # type: ignore
        self,
        message: Dict,
        observer=None,
        action=None,
        subscribing_request_ids=[],
        **kwargs,
    ):
        print("kw fire off student", message, action)

        if action == "delete":
            await self._handle_student_delete(
                message=message,
                observer=observer,
                subscribing_request_ids=subscribing_request_ids,
                **kwargs,
            )

        if action == "update":
            print("kw update stud", message, observer, kwargs)
            await self._handle_student_update(
                message=message,
                observer=observer,
                subscribing_request_ids=subscribing_request_ids,
                **kwargs,
            )

    async def _handle_student_delete(
        self,
        message: Dict,
        observer=None,
        subscribing_request_ids=[],
        **kwargs,
    ):
        student_pk = message.get("id")
        print("kw handle delete", student_pk, self.temp_user)
        if student_pk == self.temp_user:
            print("kw leave session")
            await self._leave_session_cleanup()

    async def _handle_student_update(
        self,
        message: Dict,
        observer=None,
        subscribing_request_ids=[],
        **kwargs,
    ):

        session = message.get("session")

        if session != self.session_subscribe:
            return

        await self.reply(data=message, action="update_student")

    @handle_student_change.serializer
    def handle_student_change(self, student: Student, action, **kwargs):
        print("kw serialize student", action)
        return dict(**StudentSerializer(student).data)

    # TODO: fix groups_for_signal doesn't work
    @model_observer(Session)
    async def handle_session_change(  # type: ignore
        self,
        message,
        observer=None,
        action=None,
        subscribing_request_ids=[],
        **kwargs,
    ):
        print("kw fire off session", message, action)
        if action != "update":
            return

        if message.get("pk") != self.session_subscribe:
            return

        session: Optional[Session] = await self.get_session(
            pk=self.session_subscribe
        )

        if session is None:
            return

        print(
            "kw fire handle session change", message, action, session.is_open
        )

        if not session.is_open:
            await self._leave_session(silent=True)

    @database_sync_to_async
    def _clear_reactions(self):
        students = Student.objects.filter(session__pk=self.session_subscribe)
        if not students.exists():
            return
        # students.delete()
        students.update(reaction_type=None)

    @action()
    async def clear_reactions(self, **kwargs):
        user: UserProfile = self.scope["user"]
        if not user.is_authenticated:
            return await self.notify_failure(
                action="post_question",
                errors=["Only instructor can clear reactions"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        if self.session_subscribe is None:
            return await self.notify_failure(
                action="leave_session",
                errors=["You have not joined a session yet"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        await self._clear_reactions()

        if self.channel_layer is not None:
            await self.channel_layer.group_send(
                str(self.session_subscribe),
                {
                    "type": "update_clear_reactions",
                    "message": "Reactions cleared!",
                },
            )

    # TODO: rename later
    async def update_clear_reactions(self, event: dict):
        await self.reply(
            data=event,
            action="clear_reactions",
        )

    @action()
    async def post_question(self, question_content: str, **kwargs):
        user: UserProfile = self.scope["user"]

        if user.is_authenticated:
            return await self.notify_failure(
                action="post_question",
                errors=["Only student can post a question"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        if self.temp_user is None:
            return await self.notify_failure(
                action="post_question",
                errors=["You have not joined a session yet"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        # TODO: rename
        await self.create_question(
            student_pk=self.temp_user, question_content=question_content
        )

    @action()
    async def vote_question(self, question_pk: int, **kwargs):
        user: UserProfile = self.scope["user"]

        if user.is_authenticated:
            return await self.notify_failure(
                action="vote_question",
                errors=["Only student can vote a question"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        if self.temp_user is None:
            return await self.notify_failure(
                action="vote_question",
                errors=["You have not joined a session yet"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        session = await self._get_question_session(question_pk=question_pk)

        if session is None or session.pk != self.session_subscribe:
            return await self.notify_failure(
                action="vote_question",
                errors=[
                    "This question does not belong to your current session"
                ],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        try:
            await self.update_question_vote(
                question_pk=question_pk, increment=True
            )
        except ValidationError as e:
            await self.notify_failure(**e.args[0])

    @action()
    async def unvote_question(self, question_pk: int, **kwargs):
        user: UserProfile = self.scope["user"]

        if user.is_authenticated:
            return await self.notify_failure(
                action="unvote_question",
                errors=["Only student can unvote a question"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        if self.temp_user is None:
            return await self.notify_failure(
                action="unvote_question",
                errors=["You have not joined a session yet"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        session = await self._get_question_session(question_pk=question_pk)
        if session.pk != self.session_subscribe:
            return await self.notify_failure(
                action="vote_question",
                errors=[
                    "This question does not belong to your current session"
                ],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        await self.update_question_vote(
            question_pk=question_pk, increment=False
        )

    @action()
    async def put_reaction(self, reaction_type_pk: Optional[int], **kwargs):
        if self.temp_user is None:
            return await self.notify_failure(
                action="put_reaction",
                errors=["You have not joined a session yet"],
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        await self.update_student(
            student_pk=self.temp_user, reaction_type_pk=reaction_type_pk
        )

    @model_observer(Question)
    async def handle_question_change(  # type: ignore
        self,
        message: Dict,
        observer=None,
        action=None,
        subscribing_request_ids=[],
        **kwargs,
    ):
        print("kw fire off question", action)
        if action == "create" or action == "update":
            await self._handle_question_create(
                message=message,
                observer=observer,
                subscribing_request_ids=subscribing_request_ids,
                **kwargs,
            )

    async def _handle_question_create(
        self,
        message: Dict,
        observer=None,
        subscribing_request_ids=[],
        **kwargs,
    ):
        question_pk = message.get("id")
        if question_pk is None:
            return
        session = await self._get_question_session(question_pk=question_pk)
        if session is None:
            return
        if session.pk != self.session_subscribe:
            return

        # TODO: rename to create_or_update_question?
        await self.reply(data=message, action="create_question")

    @handle_question_change.serializer
    def handle_question_change(self, question: Question, action, **kwargs):
        return dict(
            **QuestionSerializer(question).data,
        )
