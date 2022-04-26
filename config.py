import os
import uuid

basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
    SECRET_KEY = os.environ.get('SECRET_KEY') or uuid.uuid4().hex
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Default but will change in ProductionConfig depending on the PaaS provider
    HTTPS_REDIRECT = False

    # Flask-Mail config
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

    # Other email settings
    FINETUNE_ADMIN = os.environ.get('FINETUNE_ADMIN') #email address of the administrator

    FINETUNE_MAIL_SUBJECT_PREFIX = 'Finetune — '
    FINETUNE_MAIL_SENDER = f'Finetune - <{FINETUNE_ADMIN}>'

    # ----------------------------------------------
    # MY_APP_COMPS_PER_PAGE = 2
    # MY_APP_FOLLOWERS_PER_PAGE = 2

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_DEV_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_TEST_URL') or \
        f'sqlite:///{os.path.join(basedir, "data-test.sqlite")}'


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f'sqlite:///{os.path.join(basedir, "data.sqlite")}'

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        import logging
        from logging.handlers import SMTPHandler
        creds = None
        secure = None
        if getattr(cls, 'MAIL_USERNAME', None) is not None:
            creds = (cls.MAIL_USERNAME, cls.MAIL_PASSWORD)
            if getattr(cls, 'MAIL_USE_TLS', None):
                # logging: to use TLS, must pass tuple (can be empty)
                secure = ()
        mail_handler = SMTPHandler(
            mailhost=(cls.MAIL_SERVER, cls.MAIL_PORT),
            fromaddr=cls.FINETUNE_MAIL_SENDER,
            toaddrs=[cls.FINETUNE_ADMIN],
            subject=cls.FINETUNE_MAIL_SUBJECT_PREFIX + " Application Error",
            credentials=creds,
            secure=secure
        )
        mail_handler.setLevel(logging.ERROR)
        app.logger.addHandler(mail_handler)

# Production config specific to deploying to Heroku platform
class HerokuConfig(ProductionConfig):
    # HTTPS_REDIRECT is only set to True if the DYNO environment variable exists, which is set by Heroku in it's environment.
    # If testing Heroku configuration locally, the app would not use TLS.
    HTTPS_REDIRECT = True if os.environ.get('DYNO') else False

    @classmethod
    def init_app(cls, app):
        ProductionConfig.init_app(app)

        # log to stderr
        import logging
        from logging import StreamHandler
        file_handler = StreamHandler
        file_handler.setLevel(file_handler, level=logging.INFO)
        app.logger.addHandler(file_handler)

        # Heroku uses a reverse proxy server to redirect any client requests meant for the app.
        # These client requests don't go directly to the app but instead to this proxy server.
        # Because of how Heroku's proxy server works, the app would get confused and would send external links
        # like confirmation tokens through http://.
        # To ensure the app doesn't get confused, Werkzeug's ProxyFix is used fix it this 'confusion'
        from werkzeug.middleware.proxy_fix import ProxyFix
        app.wsgi_app = ProxyFix(app.wsgi_app)

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'heroku': HerokuConfig,
    'default': DevelopmentConfig
}