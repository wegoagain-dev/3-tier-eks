import os
import secrets
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Auto-generate a random key (Flask requires this, but we don't use sessions)
    SECRET_KEY = secrets.token_hex(16)
    
    # Construct Database URL safely
    _db_user = os.getenv('DB_USER', 'postgres')
    _db_password = os.getenv('DB_PASSWORD', 'password')
    _db_host = os.getenv('DB_HOST', 'db')
    _db_port = os.getenv('DB_PORT', '5432')
    _db_name = os.getenv('DB_NAME', 'devops_learning')
    
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        f'postgresql://{_db_user}:{_db_password}@{_db_host}:{_db_port}/{_db_name}'
    )
    
    # Handle the case where DATABASE_URL is literally "${...}" due to bad .env parsing
    if '${' in SQLALCHEMY_DATABASE_URI:
         SQLALCHEMY_DATABASE_URI = f'postgresql://{_db_user}:{_db_password}@{_db_host}:{_db_port}/{_db_name}'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('FLASK_DEBUG', '0').lower() in ['true', '1', 't', 'y', 'yes']
