# Installs ArgoCD using the official Helm chart.
# ArgoCD is a GitOps continuous delivery tool for Kubernetes.
#
# What it does:
# - Creates 'argocd' namespace
# - Installs ArgoCD server, repo-server, and application-controller
# - Exposes ArgoCD UI via LoadBalancer for easy access
#
# Learning: Helm is a package manager for Kubernetes (like apt/yum for Linux)

resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  namespace        = "argocd"
  create_namespace = true
  version          = var.argocd_chart_version

# Optimization: Use ClusterIP + Port Forwarding (Free & Secure)
  set {
    name  = "server.service.type"
    value = "ClusterIP"
  }
  # Minimalist Lab Settings
  set {
    name  = "redis-ha.enabled"
    value = "false"
  }
}
