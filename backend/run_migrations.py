import os
import subprocess
import logging
from sqlalchemy import create_engine, inspect, text

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_command(command):
    """Run a shell command and check for errors."""
    logging.info(f"Running command: {' '.join(command)}")
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        logging.error(f"Error running command: {' '.join(command)}")
        logging.error(result.stdout)
        logging.error(result.stderr)
        raise RuntimeError(f"Command failed: {' '.join(command)}")
    logging.info(result.stdout)
    return result

def run_migrations():
    """Initialise and apply database migrations."""
    migrations_dir = 'migrations'
    
    # Set the FLASK_APP environment variable for the flask command
    env = os.environ.copy()
    env['FLASK_APP'] = env.get('FLASK_APP', 'run.py')

    logging.info("Running database migrations...")
    if not os.path.exists(migrations_dir):
        logging.info("Initializing migrations directory...")
        run_command(['flask', 'db', 'init'])
        # Print the content of env.py for debugging
        logging.info("Content of migrations/env.py:")
        run_command(['cat', 'migrations/env.py'])
        logging.info("Generating initial migration...")
        run_command(['flask', 'db', 'migrate', '-m', 'Initial migration'])
    
    logging.info("Applying migrations...")
    run_command(['flask', 'db', 'upgrade'])

def seed_data_if_needed():
    """Seed the database if it is empty."""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        logging.error("DATABASE_URL environment variable not set.")
        raise ValueError("DATABASE_URL is not set")

    logging.info("Checking if seed data is needed...")
    logging.info(f"Connecting to database with URL: {database_url[:database_url.find('://')+3]}****:****@{database_url.split('@')[1]}")
    try:
        engine = create_engine(database_url)
        with engine.connect() as connection:
            inspector = inspect(engine)
            if inspector.has_table('topics'):
                # Check if the topics table has any rows
                result = connection.execute(text("SELECT COUNT(*) FROM topics"))
                row_count = result.scalar()
                
                if row_count == 0:
                    logging.info("Topics table is empty. Running seed data...")
                    run_command(['python', 'seed_data.py'])
                else:
                    logging.info(f"Database already contains data ({row_count} rows in topics table), skipping seed.")
            else:
                # This case should ideally not be hit if migrations ran successfully
                logging.warning("Topics table does not exist after migration. Cannot seed data.")

    except Exception as e:
        logging.error(f"An error occurred while trying to seed the database: {e}")
        raise

if __name__ == '__main__':
    logging.info(f"Environment variables: {os.environ}")
    # Database connectivity is already verified by the init container
    database_url_env = os.getenv('DATABASE_URL')
    if database_url_env:
        # --- Direct Psycopg2 Connection Test ---
        import psycopg2
        import re
        logging.info("Attempting direct psycopg2 connection...")
        try:
            # Parse DATABASE_URL for psycopg2
            match = re.match(r"postgresql://(?:(?P<user>[^:]*)(?::(?P<password>[^@]*))?@)?(?P<host>[^:/]*)(?::(?P<port>\d+))?/(?P<dbname>[^?]*)", database_url_env)
            if match:
                db_params = match.groupdict()
                # Remove None values
                db_params = {k: v for k, v in db_params.items() if v is not None}
                # Log masked parameters
                masked_params = db_params.copy()
                if 'password' in masked_params:
                    masked_params['password'] = '****'
                logging.info(f"Psycopg2 params: {masked_params}")
                
                with psycopg2.connect(**db_params) as conn:
                    with conn.cursor() as cur:
                        cur.execute("SELECT 1")
                    logging.info("Direct psycopg2 connection successful!")
            else:
                logging.error(f"Failed to parse DATABASE_URL for psycopg2: {database_url_env}")
        except Exception as e:
            logging.error(f"Direct psycopg2 connection failed: {e}")
        # --- End Direct Psycopg2 Connection Test ---

    else:
        logging.warning("DATABASE_URL not set, cannot ping database.")
    try:
        run_migrations()
        seed_data_if_needed()
        logging.info("Database setup completed successfully!")
    except (ValueError, RuntimeError) as e:
        logging.error(f"Database setup failed: {e}")
        exit(1)
