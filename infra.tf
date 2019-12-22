provider "aws" {
  profile = "default"
  region = var.aws_region
  version = "~> 2.0"
}
resource "aws_ecr_repository" "ecr-repo" {
  name = "football-repo"
}
resource "aws_ecs_cluster" "ecs-cluster" {
  name = var.cluster_name
}
resource "aws_ecs_task_definition" "service" {
  family = "football-server"
  container_definitions = "${file("football-backend/task-def.json")}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.task_exec_role_arn
}

resource "aws_alb_target_group" "football_server_tg" {
  name        = "football-server-tg"
  depends_on  = ["aws_alb.main"]
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
}

resource "aws_alb" "main" {
  name            = "football-server-lb"
  subnets         = [var.public_subnet_1, var.public_subnet_2]
  security_groups = [var.public_sg]
  internal        = false
}

resource "aws_alb_listener" "front_end" {
  load_balancer_arn = "${aws_alb.main.id}"
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.football_server_tg.id}"
    type             = "forward"
  }
}

resource "aws_ecs_service" "FootballServer" {
  name            = var.service_name
  cluster         = var.cluster_name
  task_definition = "${aws_ecs_task_definition.service.arn}"
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    container_name   = var.container_name
    container_port   = 3001
    target_group_arn = "${aws_alb_target_group.football_server_tg.id}"
  }

  network_configuration {
    security_groups = [var.private_sg]
    subnets         = [var.private_subnet]
  }
}

resource "aws_cloudwatch_log_group" "ecs" {
  name = "awslogs-football"
}