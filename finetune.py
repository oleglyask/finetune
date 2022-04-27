import os
from flask_migrate import Migrate, upgrade
from .app import create_app, db
from .app.models import Permission, User, Role

# create the app instance
app = create_app(os.getenv('FLASK_CONFIG') or 'default')

# To Initialize DB and Models
# in flask shell run db.create_all()
# migrate manages version control of database if the structure changes
# in shell run:
# flask db init - initial creation when starting to work on the project
# flask db migrate -m "comments" - migrates the database after changes have been made to models and the first time after "flask db init"
# check the script inside the migrations/version directory to verify that changes reflect the one you made
# flask db upgrade -  run after "flask db migrate" to commit changes
migrate = Migrate(app, db, render_as_batch=True) #render_as_batch is for sqlite only


# Runs after deployment via following commands on the CLI:
# "heroku run flask deploy"
# "heroku restart"
@app.cli.command()
def deploy():
    """ Run deployment tasks """
    # migrate database
    upgrade()

    # creating tables and relationships
    db.create_all()

    # inserts roles into Role table
    Role.insert_roles()


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Role=Role, Permission=Permission)