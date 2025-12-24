# 🚀 Production Grade Three-Tier App on AWS EKS (EC2, RDS, ECR, ALB, IAM, Route53), GitOps (ArgoCD), Prometheus, Grafana, Github Actions

## Overview
This project deploys a three-tier application on AWS EKS using a highly available, production-grade architecture spanning multiple availability zones. The application consists of a React frontend, Flask backend and a RDS PostgreSQL database. It demonstrates end-to-end DevOps practices with containerisation, CI/CD automation, and GitOps deployment with ArgoCD.

The app is a DevOps related quiz application where users can take quizzes on various DevOps topics, you can also add your own `.csv` files to make your custom quizzes.

I have a detailed guide on how to deploy this application on AWS EKS on my blog [here](https://wegoagain.dev/projects/end-to-end-eks-quiz).


## Key Features
- Highly available EKS cluster distributed across multiple AZs.
- ArgoCD GitOps pipeline for automated deployment.
- Full CI/CD automation from code commit → container build → cluster deployment.
- Integrated monitoring (Prometheus, Grafana) and security hardening (EKS Pod Identity, IAM least privilege).
- External RDS for database storage in AWS.


## 🏗 Architecture 
![](./images/end-to-end-k8s.svg)


## CI/CD and GitOps Workflow
![](./images/workflow.svg)


## Screenshots
![](./images/demo-app.png)
DevOps quiz app demo with quizzes with multiple choice questions.

![](./images/argo.png)
ArgoCD dashboard showing application status and logs.

![](./images/grafana.png)
Grafana dashboard showing CPU/Memory usage and utilisation for the application.


## 🚀 How to Run Locally

### Option 1: Docker Compose
The most efficient way to run the entire stack locally is using **Docker Compose**. This will start the database, run migrations, and launch both the backend and frontend.

```bash
# Clone the repository
git clone https://github.com/wegoagain-dev/3-tier-eks.git
cd 3-tier-eks

# Start the entire stack
docker compose up --build
```

Once started:
- **Frontend:** [http://localhost:8080](http://localhost:8080)
- **Backend API:** [http://localhost:8000/api](http://localhost:8000/api)

### Option 2: Kubernetes (Kind)
You can also run the full Kubernetes stack locally using `kind`.

1. **Create the Cluster:**
   ```bash
   kind create cluster
   ```

2. **Build Docker Images:**
   ```bash
   docker build -t 3-tier-eks-backend:latest ./backend
   docker build -t 3-tier-eks-frontend:latest ./frontend
   ```

3. **Load Images into Kind:**
   ```bash
   kind load docker-image 3-tier-eks-backend:latest
   kind load docker-image 3-tier-eks-frontend:latest
   ```

4. **Apply Manifests:**
   ```bash
   # Apply Namespace, Secrets, ConfigMaps, and Database
   kubectl apply -f k8s-local/namespace.yaml
   kubectl apply -f k8s-local/secrets.yaml
   kubectl apply -f k8s-local/configmap.yaml
   kubectl apply -f k8s-local/postgres.yaml
   
   # Wait for the database to be ready, then apply the rest
   kubectl wait --namespace 3-tier-app-eks \
     --for=condition=ready pod \
     --selector=app=postgres \
     --timeout=90s

   kubectl apply -f k8s-local/
   ```

5. **Access the Application:**
   Since we aren't using an Ingress Controller locally, use port-forwarding:

   ```bash
   # Frontend (Access at http://localhost:8080)
   kubectl port-forward svc/frontend -n 3-tier-app-eks 8080:80 &

   # Backend (Access at http://localhost:8000)
   kubectl port-forward svc/backend -n 3-tier-app-eks 8000:8000 &
   ```

For manual development instructions (running without Docker), see the individual `README.md` files in the `frontend/` and `backend/` directories.

  

## What is coming next
- Infrastructure as Code (IaC) for easier deployment and management of Kubernetes clusters.
- Route 53 for custom domain management.
