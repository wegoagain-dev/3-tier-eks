output "rds_endpoint" {
  value = aws_db_instance.default.endpoint
}

output "github_actions_role_arn" {
  value = aws_iam_role.github_actions.arn
}

output "db_password" {
  value     = random_password.db_password.result
  sensitive = true
}
