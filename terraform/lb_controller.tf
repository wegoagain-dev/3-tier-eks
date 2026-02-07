# AWS Load Balancer Controller - IRSA Setup
#
# IRSA (IAM Roles for Service Accounts) allows pods to use AWS permissions
# without hardcoded credentials. Here's how it works:
#
# 1. Terraform creates IAM role with trust policy (this file)
# 2. ArgoCD installs ALB Controller with ServiceAccount annotation
# 3. When pod starts, it assumes the IAM role using OIDC token
# 4. Pod gets temporary AWS credentials to create ALBs
#
# Trust Policy Explained:
# - Principal: EKS OIDC provider (created by enable_irsa = true)
# - Condition: Only allow specific ServiceAccount in kube-system namespace
# - Result: Only the ALB Controller pod can assume this role

# Fetch IAM policy from AWS (what actions ALB Controller can perform)
data "http" "alb_controller_policy" {
  url = "https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json"
}

resource "aws_iam_policy" "alb_controller" {
  name   = "AWSLoadBalancerControllerPolicy"
  policy = data.http.alb_controller_policy.response_body
}

# IAM Role that the ALB Controller ServiceAccount will assume
# The trust policy restricts this to ONLY the ALB Controller pod
resource "aws_iam_role" "alb_controller" {
  name = "AmazonEKSLoadBalancerControllerRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        # The EKS OIDC provider (created when enable_irsa = true)
        Federated = module.eks.oidc_provider_arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          # Only allow this specific ServiceAccount to assume the role
          # Format: "OIDC_PROVIDER:sub" = "system:serviceaccount:NAMESPACE:NAME"
          "${module.eks.oidc_provider}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
        }
      }
    }]
  })
}

# Attach the permissions policy to the role
resource "aws_iam_role_policy_attachment" "alb_controller" {
  role       = aws_iam_role.alb_controller.name
  policy_arn = aws_iam_policy.alb_controller.arn
}

# Terraform creates the role, ArgoCD creates the pod with the right ServiceAccount
