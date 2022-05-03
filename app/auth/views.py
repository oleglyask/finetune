
from flask import render_template, flash, redirect, url_for, request
from flask_login import current_user, login_required, login_user, logout_user
from . import auth
from .forms import LoginForm, RegisterForm, ChangePasswordForm, ChangeEmailForm
from ..models import User
from .. import db
from ..email import send_email


# @auth.route('/welcome')
# def testing():


@auth.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, password=form.password.data, confirmed=True, high_score=0)
        # in order to have email authantication working, omit confirmed=True
        # user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        db.session.add(user)
        db.session.commit()
        flash(f'Please confirm your email.  An email has been sent to {user.email}')
        token = user.generate_confirmation_token()
        # send_email(user.email, 'Welcome', 'mail/welcome', user=user)
        send_email(user.email, 'Confirm Email', 'auth/email/confirm', token=token)
        return redirect(url_for('auth.login'))
    return render_template('auth/auth_forms.html', form=form, title='register')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email_entered = form.email.data
        user = User.query.filter_by(email=email_entered).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            next = request.args.get('next')
            if next is None or not next.startswith('/'):
                next = url_for('main.home')
            return redirect(next)
        flash('email/password does not match')
    return render_template('auth/auth_forms.html', form=form, title='login')

@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@auth.route('/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    form = ChangePasswordForm()
    if form.validate_on_submit():
        if current_user.verify_password(form.current_password.data):
            current_user.password = form.password.data
            db.session.add(current_user._get_current_object())
            db.session.commit()
            flash('Your password has been changed')
            return redirect(url_for('main.index'))
        else:
            flash('You current password is not valid')
            return redirect(url_for('auth.change_password'))

    return render_template('auth/auth_forms.html', form=form, title='change password')

@auth.route('/change_email', methods=['GET', 'POST'])
@login_required
def change_email():
    form = ChangeEmailForm()
    if form.validate_on_submit():
        current_user.email = form.email.data
        db.session.add(current_user._get_current_object())
        db.session.commit()
        return redirect(url_for('auth.resend_confirmation'))
    return render_template('auth/auth_forms.html', form=form, title='change email')

# Will take a token, attempt to confirm the user, then redirect to the index page
@auth.route('/confirm/<token>')
@login_required
def confirm(token):
    if current_user.confirmed:
        # flash("You're already confirmed, silly!")
        return redirect(url_for('main.index'))
    if current_user.confirm(token):
        db.session.commit()
        flash('You have confirmed your account! Thank you.')
    else:
        # need to add resend_confirmation
        flash("Whoops! That confirmation link either expired, or it isn't valid.")
    return redirect(url_for('main.index'))

@auth.route('/resend_confirmation')
@login_required
def resend_confirmation():
    token = current_user.generate_confirmation_token()
    send_email(current_user.email, 'Confirm Email', 'auth/email/confirm', token=token)
    flash(f'New confirmation email has been sent to {current_user.email}')
    return redirect(url_for('main.index'))


# There are several conditions that will trigger the user to be redirected to '/unconfirmed' route.
# The user must be logged in, as in current_user.is_authenticated is True
# The user has not confirmed their email
# The blueprint that handles the original request is not the auth blueprint (you'll still want to allow them to confirm their account!)
# The request is not for a static file (in app/static)
@auth.before_app_request
def before_request():
    if current_user.is_authenticated:
        # will update last seen field in the User model
        current_user.ping()
        if not current_user.confirmed \
                and request.endpoint \
                and request.blueprint != 'auth' \
                and request.endpoint != 'static':
            return redirect(url_for('auth.unconfirmed'))

# There are several conditions that will trigger the user to be redirected to this new '/unconfirmed' route.
# The user must be logged in, as in current_user.is_authenticated is True
# The user has not confirmed their email
# The blueprint that handles the original request is not the auth blueprint (you'll still want to allow them to confirm their account!)
# The request is not for a static file (in app/static)
@auth.route('/unconfirmed')
def unconfirmed():
    if current_user.is_anonymous or current_user.confirmed:
        return redirect(url_for('main.index'))
    return render_template('auth/unconfirmed.html', user=current_user)