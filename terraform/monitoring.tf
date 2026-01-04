resource "helm_release" "kube_prometheus_stack" {
  name             = "prometheus"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  namespace        = "monitoring"
  create_namespace = true
  version          = "56.6.2"

  # Allow Prometheus to discover all ServiceMonitors across namespaces
  set {
    name  = "prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues"
    value = "false"
  }

  # Set Grafana admin password
  set {
    name  = "grafana.adminPassword"
    value = "admin123"
  }

  # Optional: Persist Grafana dashboards and data
  set {
    name  = "grafana.persistence.enabled"
    value = "false"
  }

  # Optional: Persist Prometheus data
  set {
    name  = "prometheus.prometheusSpec.retention"
    value = "7d"
  }
}
