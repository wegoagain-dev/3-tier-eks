# Create Namespace
resource "kubernetes_namespace" "app" {
  metadata {
    name = "3-tier-app-eks"
  }

  depends_on = [module.eks]
}

# Create ConfigMap (AUTOMATED)
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    BACKEND_URL = "http://backend:8000"
  }
}

# Create Kubernetes Secret (AUTOMATED)
resource "kubernetes_secret" "database_secret" {
  metadata {
    name      = "database-secret"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    DATABASE_URL = aws_secretsmanager_secret_version.db_string_version.secret_string
  }

  type = "Opaque"
}

# Create ExternalName Service (AUTOMATED) # acts as a DNS bridge between Kubernetes cluster and the external AWS RDS database.
resource "kubernetes_service" "postgres_db" {
  metadata {
    name      = "postgres-db"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    type          = "ExternalName"
    external_name = aws_db_instance.db.address
    port {
      port = 5432
    }
  }
}
