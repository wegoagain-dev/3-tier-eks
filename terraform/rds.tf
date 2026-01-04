# 1. Get EKS Cluster VPC
data "aws_vpc" "eks_vpc" {
  id = data.aws_eks_cluster.cluster.vpc_config[0].vpc_id
}

# 2. Get Private Subnets
data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.eks_vpc.id]
  }
  filter {
    name   = "tag:kubernetes.io/role/internal-elb"
    values = ["1"]
  }
}

# 3. Get EKS Node Security Group
data "aws_security_groups" "eks_nodes" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.eks_vpc.id]
  }  
  filter {
    name   = "tag:aws:eks:cluster-name"
    values = [var.cluster_name]
  }
}

# 4. Create Security Group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "rds-security-group"
  description = "Allow inbound traffic from EKS nodes"
  vpc_id      = data.aws_vpc.eks_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [data.aws_security_groups.eks_nodes.ids[0]]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 5. Create DB Subnet Group
resource "aws_db_subnet_group" "default" {
  name       = "three-tier-subnet-group"
  subnet_ids = data.aws_subnets.private.ids
  tags = {
    Name = "My DB subnet group"
  }
}

# 6. Generate Random Password
resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "_%@" 
}

# 7. Create RDS Instance
resource "aws_db_instance" "default" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t3.micro"
  db_name                = "devops_learning"
  username               = "postgresadmin"
  password               = random_password.db_password.result
  skip_final_snapshot    = true
  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  multi_az               = false # production turn on (jus to save cost)
  apply_immediately      = true
}
