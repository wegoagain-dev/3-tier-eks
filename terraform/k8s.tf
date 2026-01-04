# 8. Create Namespace
resource "kubernetes_namespace" "app" {
  metadata {
    name = "3-tier-app-eks"
  }
}

# 9. Create Kubernetes Secret (AUTOMATED)
resource "kubernetes_secret" "database_secret" {
  metadata {
    name      = "database-secret"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    DATABASE_URL = "postgresql://${aws_db_instance.default.username}:${random_password.db_password.result}@${aws_db_instance.default.address}:${aws_db_instance.default.port}/${aws_db_instance.default.db_name}"
    DB_PASSWORD  = random_password.db_password.result
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
    DB_NAME     = "devops_learning"
    BACKEND_URL = "http://backend:8000"
  }
}
