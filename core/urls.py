from django.urls import path, include, re_path
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from rest_framework_bulk.routes import BulkRouter
from core.consumers import SessionConsumer

from core.views import (
    ReactionTypeView,
    SessionView,
    UserProfileViewSet,
    UserSignUpView,
    QuestionView,
    StudentView,
    VerifyEmail,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
bulk_router = BulkRouter()

router.register("reaction_types", ReactionTypeView)
router.register("profile", UserProfileViewSet)
router.register("sessions", SessionView)
router.register("questions", QuestionView)
bulk_router.register("students", StudentView)


urlpatterns = [
    path("", include(router.urls)),
    path("", include(bulk_router.urls)),
    # TODO: convert to RESTful endpoints?
    path("admin/", admin.site.urls),
    path("email-verify/", VerifyEmail.as_view(), name="email-verify"),
    path("signup/", UserSignUpView.as_view()),
    path("login/", TokenObtainPairView.as_view()),
    path("login/refresh/", TokenRefreshView.as_view()),
]

websocket_urlpatterns = [
    re_path(r"ws/session/", SessionConsumer.as_asgi()),
]
