variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "eu-west-2"
}
variable "cluster_name" {
  description = "Name of the ECS cluster"
  default     = "FootballCluster"
}
variable "service_name" {
  description = "Name of the ECS service"
  default     = "FootballService"
}
variable "container_name" {
  description = "Container Name"
  default     = "FootballServer"
}
variable "private_subnet" {
  description = "ID of the private subnet"
  default     = "subnet-0b37606ca0db63202"
}
variable "private_sg" {
  description = "ID of the private sg"
  default     = "sg-0f3c0d65a7d26ddbe"
}
variable "public_subnet_1" {
  description = "ID of the public subnet 1"
  default     = "subnet-95f8bcfc"
}
variable "public_subnet_2" {
  description = "ID of the public subnet 2"
  default     = "subnet-bc1f9fc6"
}
variable "public_sg" {
  description = "ID of the public sg"
  default     = "sg-0a22fe473c22306fb"
}

variable "vpc_id" {
  description = "The VPC"
  default     = "vpc-0ac3b162"
}

variable "task_exec_role_arn" {
  description = "task exec role arn"
  default     = "arn:aws:iam::208404775560:role/ecsTaskExecutionRole"
}
