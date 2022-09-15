# Back End for Confused App
This repo contains the code running the backend logic for Confused.

## Set Up Instructions
1. Create and start a virtual environment.
```
python3 -m venv env
source env/bin/activate
```

2. Install requirement packages.
```
pip install -r requirements.txt
```

3. Run db scripts
```
python manage.py makemigrations
python manage.py migrate
```