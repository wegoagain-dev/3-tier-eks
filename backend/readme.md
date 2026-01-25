# Backend API

Flask-based REST API for the DevOps Learning Platform.

## Prerequisites

- Python 3.9+
- PostgreSQL 13+
- Docker (optional)

## Setup

1. Environment variables:
   Copy .env.example to .env and set DATABASE_URL.
   Example: DATABASE_URL=postgresql://postgres:password@localhost:5432/devops_learning

2. Local installation:
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

3. Database initialization:
   ./migrate.sh

4. Run server:
   python run.py

## Docker

1. Build:
   docker build -t backend-app .

2. Run:
   docker run -d --name backend-run -p 8000:8000 --env-file .env backend-app

3. Initialize:
   docker exec -it backend-run ./migrate.sh

## API Endpoints

- GET /api/topics: List topics
- GET /api/quiz/<topic_slug>: Get quiz
- POST /api/quiz/submit: Submit answers

## Troubleshooting

### Database Connectivity
- Local: Ensure PostgreSQL is running and DATABASE_URL in .env is correct.
- Docker: If PostgreSQL is on the host, use host.docker.internal in DATABASE_URL.
- K8s: Ensure the database service name and credentials match the environment variables in the manifest.
