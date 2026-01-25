# cluster name and vpc info

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "devops-quiz"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "Availability zones for the VPC"
  type        = list(string)
  default     = ["eu-west-2a", "eu-west-2b"]
}

variable "public_subnets" {
  description = "Public subnets for the VPC"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "private_subnets" {
  description = "Private subnets for the VPC"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "database_subnets" {
  description = "Database subnets for the VPC"
  type        = list(string)
  default     = ["10.0.100.0/24", "10.0.200.0/24"]
}

# github
variable "git_repo_url" {
  description = "GitHub repository URL for ArgoCD to watch"
  type        = string
  default     = "https://github.com/wegoagain-dev/3-tier-eks.git"
}

# Variable for your GitHub Repo
variable "github_repo" {
  description = "The GitHub repository path"
  type        = string
  default     = "wegoagain-dev/3-tier-eks" # Change this or pass via -var
}

#rds
variable "aws_db_subnet_name" {
  description = "Name for the RDS subnet group"
  type        = string
  default     = "rds-subnet-group"
}

variable "db_instance_class" {
  description = "Instance class for the RDS instance"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name for the RDS database"
  type        = string
  default     = "devops_quiz"
}

variable "db_username" {
  description = "Username for the RDS database"
  type        = string
  default     = "devops_quiz_user"
}

variable "secret_manager_name_db" {
  description = "Name for the RDS secret manager"
  type        = string
  default     = "devops_quiz_db_secret"
}
