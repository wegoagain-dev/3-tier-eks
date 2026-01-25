module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.1.0"

  name = var.cluster_name
  cidr = var.vpc_cidr

  azs              = var.azs
  public_subnets   = var.public_subnets
  private_subnets  = var.private_subnets  # gets given NAT gateway
  database_subnets = var.database_subnets # completely isoaltes

  # NAT Gateway (One for dev/portfolio to save money)
  enable_nat_gateway = true
  single_nat_gateway = true

  # Required for EKS
  enable_dns_hostnames = true
  enable_dns_support   = true
  # Tags required for EKS to discover subnets
  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1" # For public load balancers
  }
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1" # For internal load balancers
  }
  tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }
}
