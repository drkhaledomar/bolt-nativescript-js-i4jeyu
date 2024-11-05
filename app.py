from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clinic.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    parent_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    visits = db.relationship('Visit', backref='patient', lazy=True)
    prescriptions = db.relationship('Prescription', backref='patient', lazy=True)

class Visit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    diagnosis = db.Column(db.String(200), nullable=False)
    notes = db.Column(db.Text)

class Prescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    medication = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50), nullable=False)
    frequency = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    description = db.Column(db.String(200))
    status = db.Column(db.String(20), nullable=False)  # 'paid' or 'pending'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def init_db():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            users = [
                {'username': 'admin', 'password': 'admin123', 'name': 'Administrator', 'role': 'admin'},
                {'username': 'doctor1', 'password': 'doc123', 'name': 'Dr. John Wilson', 'role': 'doctor'},
                {'username': 'nurse1', 'password': 'nurse123', 'name': 'Nurse Emily Brown', 'role': 'nurse'},
                {'username': 'staff1', 'password': 'staff123', 'name': 'Robert Taylor', 'role': 'staff'}
            ]
            for user_data in users:
                user = User(
                    username=user_data['username'],
                    password_hash=generate_password_hash(user_data['password']),
                    name=user_data['name'],
                    role=user_data['role']
                )
                db.session.add(user)
            db.session.commit()

# Routes
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and check_password_hash(user.password_hash, request.form['password']):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

# API Routes
@app.route('/api/patients', methods=['GET', 'POST'])
@login_required
def patients():
    if request.method == 'POST':
        data = request.json
        patient = Patient(
            name=data['name'],
            age=data['age'],
            parent_name=data['parent_name'],
            phone=data['phone'],
            address=data['address']
        )
        db.session.add(patient)
        db.session.commit()
        return jsonify({'id': patient.id}), 201
    
    patients = Patient.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'age': p.age,
        'parent_name': p.parent_name
    } for p in patients])

@app.route('/api/visits', methods=['GET', 'POST'])
@login_required
def visits():
    if request.method == 'POST':
        data = request.json
        visit = Visit(
            patient_id=data['patient_id'],
            diagnosis=data['diagnosis'],
            notes=data['notes']
        )
        db.session.add(visit)
        db.session.commit()
        return jsonify({'id': visit.id}), 201
    
    visits = Visit.query.all()
    return jsonify([{
        'id': v.id,
        'patient_name': v.patient.name,
        'date': v.date.strftime('%Y-%m-%d'),
        'diagnosis': v.diagnosis
    } for v in visits])

if __name__ == '__main__':
    init_db()
    app.run(debug=True)