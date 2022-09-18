from core.models.Question import Question
from core.models.Session import Session
from core.models.UserProfile import UserProfile
from core.serializers.SessionSerializer import SessionSerializer
from core.serializers.UserProfileSerializer import UserProfileSerializer
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
import json
from channels.db import database_sync_to_async
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin,
    action,
)


class RoomConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    lookup_field = "pk"

    async def disconnect(self, code):
        if hasattr(self, "room_subscribe"):
            await self.remove_user_from_room(self.room_subscribe)
            await self.notify_users()
        await super().disconnect(code)

    @action()
    async def join_room(self, pk, **kwargs):
        self.room_subscribe = pk
        await self.add_user_to_room(pk)
        await self.notify_users()

    @action()
    async def leave_room(self, pk, **kwargs):
        await self.remove_user_from_room(pk)

    @action()
    async def create_question(self, question, **kwargs):
        room: Session = await self.get_room(pk=self.room_subscribe)
        await database_sync_to_async(Question.objects.create)(
            # TODO: remove _id
            student_id__session_id=room,
            student_id=self.scope["user"],
            question_content=question,
        )

    # @action()
    # async def subscribe_to_questions_in_room(self, pk, request_id, **kwargs):
    #     await self.question_activity.subscribe(room=pk, request_id=request_id)

    # @model_observer(Question)
    # async def question_activity(
    #     self, question, observer=None, subscribing_request_ids=[], **kwargs
    # ):
    #     """
    #     This is evaluated once for each subscribed consumer.
    #     The result of `@question_activity.serializer` is provided here as the question.
    #     """
    #     # since we provide the request_id when subscribing we can just loop over them here.
    #     for request_id in subscribing_request_ids:
    #         question_body = dict(request_id=request_id)
    #         question_body.update(question)
    #         await self.send_json(question_body)

    # @question_activity.groups_for_signal
    # def question_activity(self, instance: Question, **kwargs):
    #     yield "room__{instance.room_id}"
    #     yield f"pk__{instance.pk}"

    # @question_activity.groups_for_consumer
    # def question_activity(self, room=None, **kwargs):
    #     if room is not None:
    #         yield f"room__{room}"

    # @question_activity.serializer
    # def question_activity(self, instance: Question, action, **kwargs):
    #     """
    #     This is evaluated before the update is sent
    #     out to all the subscribing consumers.
    #     """
    #     return dict(
    #         data=QuestionSerializer(instance).data,
    #         action=action.value,
    #         pk=instance.pk,
    #     )

    async def notify_users(self):
        room: Session = await self.get_room(self.room_subscribe)
        for group in self.groups:
            if not self.channel_layer:
                continue
            await self.channel_layer.group_send(
                group,
                {
                    "type": "update_users",
                    "usuarios": await self.current_users(room),
                },
            )

    async def update_users(self, event: dict):
        await self.send(text_data=json.dumps({"usuarios": event["usuarios"]}))

    @database_sync_to_async
    def get_room(self, pk: int) -> Session:
        return Session.objects.get(pk=pk)

    @database_sync_to_async
    def current_users(self, room: Session):
        return [
            UserProfileSerializer(user).data
            for user in room.current_users.all()
        ]

    @database_sync_to_async
    def remove_user_from_room(self, room):
        user: UserProfile = self.scope["user"]
        user.current_rooms.remove(room)

    @database_sync_to_async
    def add_user_to_room(self, pk):
        user: UserProfile = self.scope["user"]
        if not user.current_rooms.filter(pk=self.room_subscribe).exists():
            user.current_rooms.add(Session.objects.get(pk=pk))
