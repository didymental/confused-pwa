from django.urls import path, include
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from core.views import ReactionTypeView



from core import views

router = DefaultRouter()

router.register("reaction_type", ReactionTypeView)

# router.register("profile", views.UserProfileViewSet)
router.register("sessions", SessionView)

urlpatterns = [
    # path("", include(router.urls)),
    path("admin/", admin.site.urls),
    
    # {`baseUrl`}/api/reaction_type/
    path("reaction_type/", ReactionTypeView.as_view({'get': 'list'}), name='reaction_type'),
    # path("login/", views.UserLoginApiView.as_view()),
]
