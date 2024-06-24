import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

auth_bp = Blueprint('auth', __name__)

# Database connection using environment variables
db = mysql.connector.connect(
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASSWORD'),
    database=os.getenv('MYSQL_DB')
)

# Create a cursor to interact with the database
cursor = db.cursor()

@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    # Hash the password before storing it in the database
    hashed_password = generate_password_hash(password)

    try:
        # Insert user into the database
        query = "INSERT INTO users (username, password) VALUES (%s, %s)"
        cursor.execute(query, (username, hashed_password))
        db.commit()  # Commit changes to the database

        # Generate access token for the new user
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"msg": "Failed to register"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    try:
        # Fetch user from database
        query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user[2], password):  # user[2] is the hashed password
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"msg": "Bad username or password"}), 401

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"msg": "Failed to login"}), 500

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
