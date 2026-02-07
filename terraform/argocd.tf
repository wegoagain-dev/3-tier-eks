# Installs ArgoCD using the official Helm chart.
# ArgoCD is a GitOps continuous delivery tool for Kubernetes.
#
# What it does:
# - Creates 'argocd' namespace
# - Installs ArgoCD server, repo-server, and application-controller
#
# Learning: Helm is a package manager for Kubernetes (like apt/yum for Linux)

resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  namespace        = "argocd"
  create_namespace = true
  version          = "9.4.0" # pinning to a specific version for stability

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

# Platform Root Application (Manual Bootstrap)
#
# After running `terraform apply`, bootstrap the App of Apps pattern with:
#   kubectl apply -f ../k8s/platform/root.yaml
#
# This creates the root Application that manages all platform tools (ALB, ESO, Prometheus)
# via GitOps. Keeping this manual keeps Terraform simple and focused on infrastructure.
