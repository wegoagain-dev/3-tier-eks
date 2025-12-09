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


## How to Run Locally using Docker
```bash
# Clone the repository
git clone https://github.com/wegoagain-dev/3-tier-eks.git

# Navigate to the project directory
cd 3-tier-eks

# Install dependencies
npm install

# Start the development server
npm start
```
  

## What is coming next
- Infrastructure as Code (IaC) for easier deployment and management of Kubernetes clusters.
- Route 53 for custom domain management.
