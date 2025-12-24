# 8. Create Namespace
resource "kubernetes_namespace" "app" {
  metadata {
    name = "3-tier-app-eks"
  }
}

# 9. Create Kubernetes Secret (AUTOMATED)
resource "kubernetes_secret" "db_secrets" {
  metadata {
    name      = "db-secrets"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    DB_USER     = "postgresadmin"
    DB_PASSWORD = random_password.db_password.result
    SECRET_KEY  = "dev-secret-key"
  }

  type = "Opaque"
}

# 10. Create ExternalName Service (AUTOMATED)
resource "kubernetes_service" "postgres_db" {
  metadata {
    name      = "postgres-db"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    type          = "ExternalName"
    external_name = aws_db_instance.default.address
    port {
      port = 5432
    }
  }
}

# 11. Create ConfigMap (AUTOMATED)
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    DB_HOST      = "postgres-db"
    DB_NAME      = "threetierreactdb"
    DB_PORT      = "5432"
    FLASK_DEBUG  = "0"
    BACKEND_URL  = "http://backend.3-tier-app-eks.svc.cluster.local:8000"
  }
}
