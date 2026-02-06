# Kubernetes application resources have been moved to the k8s/ directory
# to be managed by ArgoCD (GitOps pattern)
#
# Previously this file contained:
# - kubernetes_namespace.app
# - kubernetes_config_map.app_config
# - kubernetes_secret.database_secret
# - kubernetes_service.postgres_db
#
# These are now in:
# - k8s/namespace.yaml
# - k8s/configmap.yaml
# - k8s/external-secret.yaml (via External Secrets Operator)
# - k8s/external-service.yaml
#
# This separation follows production best practices:
# - Terraform manages infrastructure (VPC, EKS, RDS, IAM, cluster tools)
# - ArgoCD manages applications (deployments, services, secrets via ESO)
