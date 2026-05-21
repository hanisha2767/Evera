from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for the API

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__file__))

database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    emissions = db.relationship('Emission', backref='user', lazy=True, cascade="all, delete-orphan")
    offsets = db.relationship('Offset', backref='user', lazy=True, cascade="all, delete-orphan")

class Emission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False) # Road, Rail, Air, Sea
    value = db.Column(db.Float, nullable=False) # In kg
    date = db.Column(db.String(50), nullable=False)

class Offset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    value = db.Column(db.Float, nullable=False) # In kg
    date = db.Column(db.String(50), nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

# --- ROUTES ---

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(name=name, email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully!",
        "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email}
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return jsonify({
            "message": "Login successful!",
            "user": {"id": user.id, "name": user.name, "email": user.email}
        }), 200
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/user/<int:user_id>/data', methods=['GET'])
def get_user_data(user_id):
    user = User.query.get_or_404(user_id)
    
    emissions = Emission.query.filter_by(user_id=user.id).order_by(Emission.id.desc()).all()
    offsets = Offset.query.filter_by(user_id=user.id).all()
    
    total_emission = sum(e.value for e in emissions)
    total_offset = sum(o.value for o in offsets)
    net_emission = max(total_emission - total_offset, 0)
    
    if total_emission == 0:
        green_score = 100
    else:
        green_score = max(100 - (net_emission / total_emission) * 100, 0)
    
    history = [{"id": e.id, "type": e.type, "value": e.value, "date": e.date} for e in emissions]
    
    return jsonify({
        "totalEmission": total_emission,
        "totalOffset": total_offset,
        "netEmission": net_emission,
        "greenScore": green_score,
        "history": history
    }), 200

@app.route('/api/user/<int:user_id>/emission', methods=['POST'])
def add_emission(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    mode = data.get('mode')
    weight = data.get('weight')
    distance = data.get('distance')
    
    if not mode or weight is None or distance is None:
        return jsonify({"error": "Missing fields"}), 400
        
    try:
        weight = float(weight)
        distance = float(distance)
    except ValueError:
        return jsonify({"error": "Invalid numeric values"}), 400

    factors = {"Road": 80, "Rail": 15, "Air": 550, "Sea": 20}
    factor = factors.get(mode, 0)
    
    value = (weight * distance * factor) / 1000
    date_str = datetime.now().strftime("%m/%d/%Y")
    
    new_emission = Emission(user_id=user.id, type=mode, value=value, date=date_str)
    db.session.add(new_emission)
    db.session.commit()
    
    return jsonify({
        "message": "Emission added",
        "emission": {"id": new_emission.id, "type": new_emission.type, "value": new_emission.value, "date": new_emission.date}
    }), 201

@app.route('/api/user/<int:user_id>/emission/<int:emission_id>', methods=['DELETE'])
def delete_emission(user_id, emission_id):
    emission = Emission.query.filter_by(id=emission_id, user_id=user_id).first_or_404()
    db.session.delete(emission)
    db.session.commit()
    return jsonify({"message": "Emission deleted"}), 200

@app.route('/api/user/<int:user_id>/offset', methods=['POST'])
def add_offset(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    value = data.get('value')
    
    if value is None:
        return jsonify({"error": "Missing value"}), 400
        
    date_str = datetime.now().strftime("%m/%d/%Y")
    new_offset = Offset(user_id=user.id, value=float(value), date=date_str)
    db.session.add(new_offset)
    db.session.commit()
    
    return jsonify({
        "message": "Offset added",
        "offset": {"id": new_offset.id, "value": new_offset.value, "date": new_offset.date}
    }), 201

@app.route('/api/user/<int:user_id>/offset/<int:offset_id>', methods=['DELETE'])
def delete_offset(user_id, offset_id):
    offset = Offset.query.filter_by(id=offset_id, user_id=user_id).first_or_404()
    db.session.delete(offset)
    db.session.commit()
    return jsonify({"message": "Offset deleted"}), 200

@app.route('/api/user/<int:user_id>/profile', methods=['POST'])
def update_profile(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    
    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400
        
    existing_user = User.query.filter_by(email=email).first()
    if existing_user and existing_user.id != user.id:
        return jsonify({"error": "Email is already in use by another account"}), 400
        
    user.name = name
    user.email = email
    db.session.commit()
    
    return jsonify({
        "message": "Profile updated successfully",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }), 200

@app.route('/api/user/<int:user_id>/change-password', methods=['POST'])
def change_password(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    
    if not current_password or not new_password:
        return jsonify({"error": "Current password and new password are required"}), 400
        
    if not check_password_hash(user.password, current_password):
        return jsonify({"error": "Current password is incorrect"}), 400
        
    user.password = generate_password_hash(new_password, method='pbkdf2:sha256')
    db.session.commit()
    
    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/api/user/<int:user_id>/reset', methods=['DELETE'])
def reset_data(user_id):
    user = User.query.get_or_404(user_id)
    
    Emission.query.filter_by(user_id=user_id).delete()
    Offset.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({"message": "All emissions and offsets deleted successfully"}), 200

if __name__ == '__main__':
    # host='0.0.0.0' makes it visible to your phone on the Wi-Fi
    app.run(host='0.0.0.0', port=5000, debug=True)
