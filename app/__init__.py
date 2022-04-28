
from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
# from ..config import config
from config import config
from flask_mail import Mail
from flask_moment import Moment
from flask_wtf.csrf import CSRFProtect

# Initialize Bootstrap by passing a Flask instance to it in the constructor
bootstrap = Bootstrap()
# Initialize database object
db = SQLAlchemy()
# Initialize the Login manager object
login_manager = LoginManager()
login_manager.login_view = 'auth.login' # View to redirect if @login_required
# Initialize the Mail object
mail = Mail()
# Moment object will help convert time to user's local time
moment = Moment()
#  Flask-WTF's CSRFProtect object will protected from CSRF attacks
csrf = CSRFProtect()

def create_app(config_name='default'):

    # Initialize Flask app
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app) #config[config_name] will transform into Config class static -> ConfigClass.init_app(app)

    # initializing variables that were created earlier with no app parameters
    bootstrap.init_app(app)
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    csrf.init_app(app)

    # register bluprints with the app
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    ########### FOR PRODUCTION DEPLOYMENT ONLY ######################
    ########### Changes from Vanilla HTTP to SECURE HTTPS ##########
    # Flask-Talisman would clamp down on security by outright disallowing scripts or styles from outside the app, known as 'self' above.
    # The additions to the policy will allow the app to use Bootstrap styling and to download images from anywhere.
    # If new features added to the app, will need to update the content_security_policy to allow additional resources
    # from outside the app.
    if app.config['HTTPS_REDIRECT']:
        from flask_talisman import Talisman
        Talisman(app, content_security_policy={
                'default-src': [
                    "'self'",
                    'cdnjs.cloudflare.com',
                    'cdn.jsdelivr.net',
                ],
                # allo inline script source.  Must add <script nonce="{{ csp_nonce() }}"> to html tag
                'script-src': '\'self\'',
                # allow images from anywhere,
                #   including unicornify.pictures
                'img-src': '*'
            }
        )
    #################################################################

    return app