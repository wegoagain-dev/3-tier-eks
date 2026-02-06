# Frontend

React-based frontend for the DevOps Learning Platform.

## Prerequisites

- Node.js 18+
- Backend running on port 8000

## Setup

1. Install dependencies:
   npm install

2. Start development server:
   npm start
   App runs at http://localhost:3000

## Docker

1. Build:
   docker build -t frontend-app .

2. Run:
   docker run -p 3000:8080 -e BACKEND_URL="http://host.docker.internal:8000" frontend-app

## Building for Production

npm run build

## Troubleshooting

### API Connection Issues
- Local Dev: Ensure the backend is running on http://localhost:8000.
- Docker: Check that BACKEND_URL is set correctly. Use http://host.docker.internal:8000 for host-run backend.
- Production (K8s): Ensure BACKEND_URL points to the correct Service DNS.
