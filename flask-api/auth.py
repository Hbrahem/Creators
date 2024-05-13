# auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import sqlite3
from flask_cors import CORS

auth_blueprint = Blueprint('auth', __name__)
CORS(auth_blueprint) 

def create_users_table():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY,
                        username TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        role TEXT NULL
                    )''')
    conn.commit()
    conn.close()

create_users_table()

def get_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT username, password, role FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user

def create_user(username, password,email):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, password,email) VALUES (?, ?, ?)", (username, password,email))
    conn.commit()
    conn.close()

def add_role_to_user(username, role):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET role = ? WHERE username = ?", (role, username))
    conn.commit()
    conn.close()

# Function to fetch all users
def get_all_users():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT username, email, role FROM users")
    users = [{"username" : user[0] , "email" : user[1], "role" : "No Role" if user[2]=="" else user[2]} for user in cursor.fetchall()]
    conn.close()
    return users

# Route to add a role to a user
@auth_blueprint.route('/add_role', methods=['POST'])
# @jwt_required()  
def add_role():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    role = request.json.get('role', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not role:
        return jsonify({"msg": "Missing role parameter"}), 400

    # Call function to add role to user
    add_role_to_user(username, role)
    return jsonify({"msg": f"Role '{role}' added to user '{username}' successfully"}), 200

# Route to fetch all users
@auth_blueprint.route('/users', methods=['GET'])
# @jwt_required()  
def fetch_users():
    users = get_all_users()
    return jsonify(users), 200

# Route to fetch all users
@auth_blueprint.route('/get_role', methods=['POST'])
# @jwt_required()  
def get_role():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    users = get_all_users()
    user  = [user for user in users if user['username'] == username]
    return jsonify(user), 200

@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    email = request.json.get('email', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    existing_user = get_user(username)
    if existing_user:
        return jsonify({"msg": "Username already exists"}), 400

    create_user(username, password,email)
    return jsonify({"msg": "User created successfully"}), 201


@auth_blueprint.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    user = get_user(username)
    if not user or user[1] != password:
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token,role=user[2]), 200
