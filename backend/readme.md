# DevOps Learning Platform - Backend

A Flask-based REST API backend for the DevOps Learning Platform. This application provides endpoints for managing DevOps topics and quizzes.

## Prerequisites

- **Python**: 3.9+
- **PostgreSQL**: 13+
- **Docker** (Optional, for containerized execution)

## ⚙️ Configuration (Required)

The application is configured using environment variables. It now uses a single `DATABASE_URL` to connect to the database.

1.  **Copy the example file:**
    ```bash
    cp .env.example .env
    ```

2.  **Edit `.env`:**
    Update the `DATABASE_URL` in the `.env` file to point to your PostgreSQL instance. For a local setup, it would typically be:
    ```
    DATABASE_URL=postgresql://postgres:password@localhost:5432/devops_learning
    ```

## 🚀 Quick Start (Local Python)

1.  **Start PostgreSQL:**
    Ensure you have a Postgres database running. You can start one with Docker:
    ```bash
    docker run --name flask_postgres \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=password \
      -e POSTGRES_DB=devops_learning \
      -p 5432:5432 \
      -d postgres
    ```

2.  **Setup Environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3.  **Initialize Database:**
    ```bash
    ./migrate.sh
    ```
    *Note: If `migrate.sh` fails permissions locally, try `bash migrate.sh` or run the commands inside it manually.*

4.  **Run Server:**
    ```bash
    python run.py
    ```

## 🐳 Running with Docker

1.  **Build the image:**
    ```bash
    docker build -t backend-app .
    ```

2.  **Run the container:**
    Make sure your `.env` file is up-to-date. The `DATABASE_URL` should be configured to connect to your database. If you are running Postgres on your host machine, you might need to use `host.docker.internal` as the hostname in your `DATABASE_URL`.
    ```bash
    docker run -d --name backend-run \
      -p 8000:8000 \
      --env-file .env \
      backend-app
    ```

3.  **Populate the Database (Critical Step):**
    The database starts empty. You must manually trigger the migration script inside the running container.
    ```bash
    docker exec -it backend-run ./migrate.sh
    ```

## Project Structure

```
backend/
├── app/              # Application logic
├── migrations/       # Database schema versions
├── .env.example      # Template for environment variables
├── Dockerfile        # Container definition
├── migrate.sh        # Setup script (Migration + Seeding)
└── requirements.txt  # Dependencies
```

## API Endpoints

*   `GET /api/topics`: List all topics.
*   `GET /api/quiz/<topic_slug>`: Get a quiz.
*   `POST /api/quiz/submit`: Submit answers.
