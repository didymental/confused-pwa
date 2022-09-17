from django.urls import path, include
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from rest_framework_bulk.routes import BulkRouter

from core.views import (
    ReactionTypeView,
    SessionView,
    UserProfileViewSet,
    UserSignUpView,
    QuestionView,
    StudentView,
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
router.register("students", StudentView)
router.register("questions", QuestionView)
bulk_router.register("students_sessions", StudentView)

urlpatterns = [
    path("", include(router.urls)),
    path("", include(bulk_router.urls)),
    # TODO: convert to RESTful endpoints?
    path("admin/", admin.site.urls),
    path("signup/", UserSignUpView.as_view()),
    path("login/", TokenObtainPairView.as_view()),
    path("login/refresh/", TokenRefreshView.as_view()),
]
