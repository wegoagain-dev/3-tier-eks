resource "helm_release" "kube_prometheus_stack" {
  name             = "prometheus"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  namespace        = "monitoring"
  create_namespace = true
  version          = "56.6.2"

  depends_on = [module.eks]

  # Set Grafana admin password
  set {
    name  = "grafana.adminPassword"
    value = "admin123"
  }

  # if not service type 'LoadBalancer' would have to use CLI port-forwarding to see the dashboard. command kubectl get svc -n monitoring
  # if service tpye 'ClusterIP' use kubectl port-forward svc/prometheus-grafana -n monitoring 8080:80
  set {
    name  = "grafana.service.type"
    value = "ClusterIP"
  }

  # Optional: Persist Grafana dashboards and data
  set {
    name  = "grafana.persistence.enabled"
    value = "false"
  }
}
