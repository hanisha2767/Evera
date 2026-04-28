from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for the API

# Database Configuration
# The database file 'users.db' will be created in this folder
basedir = os.path.abspath(os.path.dirname(__file__))

# Render provides DATABASE_URL for Postgres. It often starts with 'postgres://' which SQLAlchemy doesn't support, so we fix it.
database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

# Use PostgreSQL if available, otherwise fallback to local SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# User Model (The Database Table)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

# --- SIGNUP ROUTE ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Get details from the request
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # 1. Simple Validation
    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # 2. Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    # 3. Securely hash the password
    hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')

    # 4. Save to Database
    new_user = User(name=name, email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

# --- LOGIN ROUTE ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return jsonify({"message": "Login successful!"}), 200
    
    return jsonify({"error": "Invalid email or password"}), 401

if __name__ == '__main__':
    # host='0.0.0.0' makes it visible to your phone on the Wi-Fi
    app.run(host='0.0.0.0', port=5000, debug=True)
