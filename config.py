import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Mail config
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

    # Other email settings
    FINETUNE_ADMIN = os.environ.get('FINETUNE_ADMIN') #email address of the administrator

    FINETUNE_MAIL_SUBJECT_PREFIX = 'Finetune — '
    FINETUNE_MAIL_SENDER = f'Finetune Admin <{FINETUNE_ADMIN}>'

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

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}