# create bucket (with same name as the backend s3) first in aws with bucket name, region, versioning, encryption, block public access


terraform {
  required_version = ">= 1.0"
  # required_providers is like the package.json, downlaoding the binaries/tools to be able to use them
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    http = {
      source  = "hashicorp/http"
      version = "~> 3.4"
    }
  }
  backend "s3" {
    bucket       = "devops-quiz-terraform-state"
    key          = "dev/terraform.tfstate"
    region       = "eu-west-2"
    encrypt      = true
    use_lockfile = true
  }

}

provider "aws" {
  region = var.aws_region

  # tags will be applied to EVERY resource created by this provider
  default_tags {
    tags = {
      Project     = "devops-quiz-eks"
      Environment = "Dev"
      ManagedBy   = "Terraform"
    }
  }
}

# 2. Configure Kubernetes Provider (so we know which cluster to talk to)
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", var.cluster_name]
    command     = "aws"
  }
}

# 3. Configure Helm Provider
provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", var.cluster_name]
      command     = "aws"
    }
  }
}
