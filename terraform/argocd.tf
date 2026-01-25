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
  version          = "5.51.6"

  depends_on = [module.eks]

  # Optimization: Use ClusterIP + Port Forwarding (Free & Secure)
  # use kubectl port-forward svc/argocd-server -n argocd 8080:443
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
