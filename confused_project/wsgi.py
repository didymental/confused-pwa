"""
WSGI config for confused_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

if "DYNO_RAM" in os.environ:
    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE", "confused_project.settings.production"
    )
else:
    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE", "confused_project.settings.development"
    )


application = get_wsgi_application()
