provider "aws" {
  region = var.aws_region
}

resource "aws_db_instance" "postgres" {
  identifier           = "distroviz-postgres"
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = "db.t3.micro"
  allocated_storage    = 20
  username            = var.postgres_user
  password            = var.postgres_password
  db_name             = var.postgres_db
  skip_final_snapshot = true
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "distroviz-redis"
  engine              = "redis"
  engine_version      = "7.0"
  node_type           = "cache.t3.micro"
  num_cache_nodes     = 1
  parameter_group_name = "default.redis7"
}

resource "aws_rds_cluster" "postgres_cluster" {
  cluster_identifier  = "distroviz-cluster"
  engine              = "aurora-postgresql"
  engine_version      = "15.3"
  database_name       = var.postgres_db
  master_username     = var.postgres_user
  master_password     = var.postgres_password
  skip_final_snapshot = true
}

output "postgres_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.redis.redis_endpoint
}