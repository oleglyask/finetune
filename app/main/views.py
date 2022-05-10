from flask import redirect, render_template, flash, url_for, current_app, request
from flask_login import current_user, login_required

from .forms import EditProfileForm, AdminLevelEditProfileForm
from . import main
from .. import db
from ..models import User, Role, Permission, Note
from ..decorators import admin_required, permission_required

# Start page
@main.route('/')
def index():
    return render_template('index.html')

# Home page
@main.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    return render_template('home.html')

# game page
@main.route('/play')
@login_required
def play():
    current_user.ping()
    level = request.args.get('level', 'basic')
    flats = request.args.get('flats', 'false')
    sharps = request.args.get('sharps', 'false')
    accidentals = request.args.get('accidentals', 'false')
    learningMode = request.args.get('learningMode', 'true')
    notes = [
        Note('C', 'white', True, False),
        Note('Db', 'black', alt='C#_Db'),
        Note('D', 'white', True, True),
        Note('Eb', 'black', alt='D#_Eb'),
        Note('E', 'white', False, True),
        Note('F', 'white', True, False),
        Note('Gb', 'black', alt='F#_Gb'),
        Note('G', 'white', True, True),
        Note('Ab', 'black', alt='G#_Ab'),
        Note('A', 'white', True, True),
        Note('Bb', 'black', alt='A#_Bb'),
        Note('B', 'white', False, True)
    ]
    return render_template('piano.html', notes=notes, high_score=current_user.high_score, level=level, flats=flats,
                    sharps=sharps, accidentals=accidentals, learningMode=learningMode)

# called when user pressed the Exit button on the game page
@main.route('/exit/<score>')
@login_required
def exit(score):
    if (not current_user.high_score) or (int(score) > current_user.high_score):
        current_user.high_score = score
        flash('You got a new High score')
        db.session.add(current_user._get_current_object())
        db.session.commit()
    return redirect(url_for('main.top_scores'))

# will display top scores
@main.route('/topscores')
@login_required
def top_scores():
    top_users = User.query.filter(User.high_score != None).order_by(User.high_score.desc()).limit(10).all()
    return render_template('top_scores.html', top_users=top_users)

# route() comes first
# then check if user authenticated
# then check their permission
# The topmost decorators are "evaluated" before the others

@main.route('/admin')
@login_required
@admin_required
def for_admins_only():
    return render_template('admin_only.html', users=User.query.all())

# will get a user object and render the user.html.  If no user found, then 404 page will be rendered
@main.route('/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    # page = request.args.get('page', 1, type=int)
    # pagination = Composition.query.order_by(Composition.timestamp.desc()).paginate(
    #         page,
    #         per_page=current_app.config['MY_APP_COMPS_PER_PAGE'],
    #         error_out=False)
    # compositions = pagination.items
    # return render_template('user.html', user=user, compositions=compositions, pagination=pagination)
    return render_template('profile.html', user=user)

# will allow user to edit it's profile
@main.route('/edit-profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm()
    if form.validate_on_submit():
        current_user.name = form.name.data
        current_user.location = form.location.data
        current_user.bio = form.bio.data
        db.session.add(current_user._get_current_object())
        db.session.commit()
        flash('You successfully updated your profile! Looks great.')
        return redirect(url_for('main.user', username=current_user.username))
    form.name.data = current_user.name
    form.location.data = current_user.location
    form.bio.data = current_user.bio
    return render_template('auth/auth_forms.html', form=form, title='profile')

# will allow Admin to edit anyone's profile
@main.route('/editprofile/<int:id>', methods=['GET', 'POST'])
@login_required
@admin_required
def admin_edit_profile(id):
    user = User.query.filter_by(id=id).first()
    form = AdminLevelEditProfileForm(role=user.role_id, user=user) #will default to the user's current role
    if form.validate_on_submit():
        user.username = form.username.data
        user.confirmed = form.confirmed.data
        user.role_id = form.role.data
        user.name = form.name.data
        user.location = form.location.data
        user.bio = form.bio.data
        db.session.add(user)
        db.session.commit()
        flash('You successfully updated profile! Looks great.')
        return redirect(url_for('main.user', username=user.username))

    form.username.data = user.username
    form.confirmed.data = user.confirmed
    form.name.data = user.name
    form.location.data = user.location
    form.bio.data = user.bio
    return render_template('auth/auth_forms.html', form=form, title='profile')
