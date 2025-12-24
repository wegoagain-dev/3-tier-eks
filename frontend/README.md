# DevOps Learning Platform - Frontend

A React-based frontend for the DevOps Learning Platform. This application provides an interactive interface for learning DevOps concepts and taking quizzes.

## Prerequisites

- **Node.js**: 18+ (Recommended)
- **Backend**: The backend service must be running on port `8000` for local development.

## 🚀 Quick Start (Local Development)

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will open at `http://localhost:3000`.
    *Note: It is configured to look for the backend at `http://localhost:8000/api` when running locally.*

## 🐳 Running with Docker

Since the application is containerized, you can run it without installing Node.js locally.

1.  **Build the image:**
    ```bash
    docker build -t frontend-app .
    ```

2.  **Run the container:**
    ```bash
    docker run -p 3000:80 \
      -e BACKEND_URL="http://host.docker.internal:8000" \
      frontend-app
    ```
    *   `BACKEND_URL`: Sets the API endpoint for the Nginx proxy. Use `http://host.docker.internal:8000` to reach a backend running on your host machine.

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

This generates a `build/` directory containing the static assets ready for deployment (e.g., via Nginx).

## Project Structure

```
frontend/
├── public/                 # Static assets (favicon, manifest)
├── src/
│   ├── components/         # React components
│   │   ├── Home.js         # Landing page with topics
│   │   ├── Navbar.js       # Navigation bar
│   │   ├── Quiz.js         # Quiz interface
│   │   └── QuestionManager.js # Admin interface for questions
│   ├── config/
│   │   └── api.js          # API URL configuration logic
│   ├── services/
│   │   └── api.js          # API fetch functions
│   └── App.js              # Main application router
├── Dockerfile              # Multi-stage Docker build definition
└── nginx.conf.template     # Nginx configuration with env substitution
```

## Features

*   **Home Page:** Browse DevOps topics and start quizzes.
*   **Quiz Interface:** Interactive multiple-choice questions with immediate scoring.
*   **Question Manager:** Admin dashboard to add single questions or bulk upload via CSV.

## Troubleshooting

### API Connection Issues
*   **Local Dev:** Ensure the backend is running on `http://localhost:8000`.
*   **Docker:** Check that `BACKEND_URL` is set correctly. If using Docker Compose, use the service name (e.g., `http://backend:8000`).
*   **Production (K8s):** Ensure the `BACKEND_URL` env var in the deployment manifest points to the correct Service DNS (e.g., `http://backend.namespace.svc.cluster.local:8000`).