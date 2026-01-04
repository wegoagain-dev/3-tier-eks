import os
import secrets
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Auto-generate a random key (Flask requires this, but we don't use sessions)
    SECRET_KEY = secrets.token_hex(16)
    
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('FLASK_DEBUG', '0').lower() in ['true', '1', 't', 'y', 'yes']

