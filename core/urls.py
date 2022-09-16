from django.urls import path, include
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from core.views import (
    ReactionTypeView,
    SessionView,
    UserProfileViewSet,
    UserSignUpView,
    UserLoginApiView,
)

router = DefaultRouter()

router.register("reaction_types", ReactionTypeView)
router.register("profile", UserProfileViewSet)
router.register("sessions", SessionView)

urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path("login/", UserLoginApiView.as_view()),
    path("signup/", UserSignUpView.as_view()),
]
