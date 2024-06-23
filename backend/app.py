from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS  # Import CORS from flask_cors
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Load secret key from environment variable
jwt = JWTManager(app)
CORS(app)  # Allow CORS for all routes

# Import and register blueprints
from auth import auth_bp
from chat import chat_bp, configure_mysql

configure_mysql(app) 

app.register_blueprint(auth_bp, url_prefix='/auth')  # Prefix all routes in auth_bp with '/auth'
app.register_blueprint(chat_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
