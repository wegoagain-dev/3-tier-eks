resource "aws_ecr_repository" "backend" {
  name                 = "3-tier-eks-backend"
  image_tag_mutability = "MUTABLE" # Allows you to overwrite 'latest' tag
  force_delete         = true      # Allows destroying repo even if it has image

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "3-tier-eks-frontend"
  image_tag_mutability = "MUTABLE" # Allows you to overwrite 'latest' tag
  force_delete         = true      # Allows destroying repo even if it has image

  image_scanning_configuration {
    scan_on_push = true
  }
}
