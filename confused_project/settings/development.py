import os

# from decouple import config

from confused_project.settings.common import *


# SECRET_KEY = config("SECRET_KEY", default="")
# if not SECRET_KEY:
#     with open(os.path.join(BASE_DIR, "secret_key.txt")) as f:
#         SECRET_KEY = f.read().strip()

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "q6c2shz22py=qyol6b5i^jvs77y=cejvdb)i6a!0s172dr4rp%"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}
