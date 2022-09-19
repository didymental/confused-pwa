"""
ASGI config for confused_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter


from .channelsmiddleware import JwtAuthMiddlewareStack
import core.urls


os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "confused_project.settings.development"
)


# TODO: https
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JwtAuthMiddlewareStack(
            URLRouter(core.urls.websocket_urlpatterns)
        ),
    }
)
