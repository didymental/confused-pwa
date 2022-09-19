import os

import django_heroku
import dj_database_url
from confused_project.settings.common import *


# TODO: secure secret key, update allowed hosts

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "q6c2shz22py=qyol6b5i^jvs77y=cejvdb)i6a!0s172dr4rp%"


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: update this when you have the production host
ALLOWED_HOSTS = [
    "confused-backend-3216.herokuapp.com",
]  # to update when we have the production host


DATABASES = {}
DATABASES["default"] = dj_database_url.config(conn_max_age=600)
django_heroku.settings(locals())
options = DATABASES["default"].get("OPTIONS", {})
if options:
    options.pop("sslmode", None)


# HTTPS settings
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# TODO: configure HTTPS for Elastic Beanstalk environment
# SECURE_SSL_REDIRECT = True

# HSTS settings
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# AWS_STORAGE_BUCKET_NAME = "digitalace"
# AWS_S3_CUSTOM_DOMAIN = "%s.s3.amazonaws.com" % AWS_STORAGE_BUCKET_NAME

CORS_ALLOW_ALL_ORIGINS = True

# CORS_ALLOWED_ORIGINS = [
#     "http://eizea.com",
#     "http://www.eizea.com",
#     "https://eizea.com",
#     "https://www.eizea.com",
#     "http://digitalace-env.eba-jj7vp4ec.us-east-2.elasticbeanstalk.com",
#     "http://localhost:3000",
#     "http://eizea.com/",
#     "http://www.eizea.com/",
#     "https://eizea.com/",
#     "https://www.eizea.com/",
#     "http://digitalace-env.eba-jj7vp4ec.us-east-2.elasticbeanstalk.com/",
#     "http://localhost:3000/",
# ]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
}

# WHITENOISE_USE_FINDERS = True
# WHITENOISE_MANIFEST_STRICT = False
# WHITENOISE_ALLOW_ALL_ORIGINS = True
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
