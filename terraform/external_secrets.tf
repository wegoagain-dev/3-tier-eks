# External Secrets Operator - IRSA Setup
#
# ESO syncs secrets from AWS Secrets Manager to Kubernetes.
# Uses IRSA so the ESO pod can access AWS without hardcoded credentials.
#
# How it works:
# 1. RDS password stored in AWS Secrets Manager (by Terraform)
# 2. ESO pod assumes IAM role via IRSA
# 3. ESO reads secret from AWS, creates Kubernetes Secret
# 4. Application pods mount the Kubernetes Secret
#
# This keeps secrets out of Git and Terraform state

# IAM Policy: What ESO is allowed to do in AWS
# Only allows reading specific secrets (principle of least privilege)
resource "aws_iam_policy" "external_secrets" {
  name        = "${var.cluster_name}-external-secrets-policy"
  description = "Policy for External Secrets Operator to access AWS Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        # Only allow access to the database secret
        Resource = [
          aws_secretsmanager_secret.db_credentials.arn
        ]
      }
    ]
  })
}

# IAM Role that ESO ServiceAccount will assume
# Trust policy restricts this to ONLY the ESO pod
resource "aws_iam_role" "external_secrets" {
  name = "${var.cluster_name}-external-secrets-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        # EKS OIDC provider (created by enable_irsa = true)
        Federated = module.eks.oidc_provider_arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          # Only this ServiceAccount can assume the role
          "${module.eks.oidc_provider}:sub" = "system:serviceaccount:external-secrets:external-secrets"
          # Standard AWS STS audience
          "${module.eks.oidc_provider}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })
}

# Attach permissions to the role
resource "aws_iam_role_policy_attachment" "external_secrets" {
  role       = aws_iam_role.external_secrets.name
  policy_arn = aws_iam_policy.external_secrets.arn
}
