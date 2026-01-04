variable "git_repo_url" {
  description = "GitHub repository URL for ArgoCD to watch"
  type        = string
  default     = "https://github.com/wegoagain-dev/3-tier-eks.git"
}

# Variable for your GitHub Repo (e.g., "your-user/your-repo")
variable "github_repo" {
  description = "The GitHub repository path (e.g., 'wegoagain-dev/3-tier-eks')"
  type        = string
  default     = "wegoagain-dev/3-tier-eks" # Change this or pass via -var
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "three-tier"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "argocd_chart_version" {
  description = "ArgoCD Helm chart version"
  type        = string
  default     = "5.51.6"
}
