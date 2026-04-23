variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "postgres_user" {
  description = "PostgreSQL username"
  type        = string
  default     = "distroviz_user"
}

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "postgres_db" {
  description = "PostgreSQL database name"
  type        = string
  default     = "distroviz"
}