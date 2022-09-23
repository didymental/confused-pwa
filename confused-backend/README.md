# Back End for Confused App
This repo contains the code running the backend logic for Confused.

The backend has been deployed onto Heroku. Read more details on how here:
https://bennettgarner.medium.com/deploying-django-to-heroku-procfile-static-root-other-pitfalls-e7ab8b2ba33b

## Set Up Instructions for Local
1. Create and start a virtual environment.
```
python3 -m venv env
source env/bin/activate
```

2. Install requirement packages.
```
pip install -r requirements.txt
```
or 
```
python -m pip install -r requirements.txt
```

3. Run db scripts
```
python manage.py makemigrations
```
```
python manage.py migrate
```
## Set Up Instructions for Heroku Prod Environment
1. Push main branch to heroku via CLI
```
git push heroku main
```
2. Run db scripts on heroku (can skip if no changes to db)
```
heroku run python manage.py makemigrations
```
```
heroku run python manage.py migrate
```
