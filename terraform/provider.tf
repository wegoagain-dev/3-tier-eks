provider "aws" {
  region = "eu-west-2"
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}
