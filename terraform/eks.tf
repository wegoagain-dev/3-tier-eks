module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"
  # Basic cluster config
  cluster_name    = var.cluster_name
  cluster_version = "1.31"
  # Networking (from the VPC module)
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  # Managed Node Group
  eks_managed_node_groups = {
    standard-workers = {
      # Instance config
      instance_types = ["t3.medium"]

      # Scaling config
      min_size     = 1
      max_size     = 3
      desired_size = 2
      # IAM policies
      iam_role_additional_policies = {
        AmazonEKSWorkerNodePolicy          = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
        AmazonEKS_CNI_Policy               = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
        AmazonEC2ContainerRegistryReadOnly = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
        CloudWatchAgentServerPolicy        = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
      }
    }
  }
  # Enable OIDC provider (needed for ALB controller, etc.), Kubernetes Service Account can assume this specific AWS IAM Role
  enable_irsa                    = true
  cluster_endpoint_public_access = true # to allow access from outside the VPC
}
