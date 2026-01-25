resource "aws_db_subnet_group" "rds" {
  name       = var.aws_db_subnet_name
  subnet_ids = module.vpc.database_subnets # from vpc
}

# 2. Security Group for RDS
resource "aws_security_group" "rds" {
  name   = "${var.cluster_name}-rds-sg"
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    # ONLY allow traffic from the EKS nodes
    security_groups = [module.eks.node_security_group_id] # eks creates a output of node and cluster sg
  }
  tags = { Name = "${var.cluster_name}-rds-sg" }
}


# Create RDS Instance
resource "aws_db_instance" "db" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "16.8"
  instance_class         = var.db_instance_class
  db_name                = var.db_name
  username               = var.db_username
  password               = random_password.password.result
  port                   = 5432
  skip_final_snapshot    = true # skip final snapshot for terraform destory, saving me time, false for prod
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  multi_az               = false # to save money, on for production
}

# random password generator
resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}
# create secrets manager
resource "aws_secretsmanager_secret" "db_string" {
  name = var.secret_manager_name_db
}
# store db  in secrets manager
resource "aws_secretsmanager_secret_version" "db_string_version" {
  secret_id     = aws_secretsmanager_secret.db_string.id
  secret_string = "postgresql://${var.db_username}:${random_password.password.result}@${aws_db_instance.db.address}:5432/${var.db_name}"
}
