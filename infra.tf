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

# FRONT-END

resource "aws_s3_bucket" "logs" {
  bucket = "${var.site_name}-site-logs"
  acl = "log-delivery-write"
}

resource "aws_s3_bucket" "www_site" {
  bucket = "www.${var.site_name}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "OnlyCloudfrontReadAccess",
      "Principal": {
        "CanonicalUser": "${aws_cloudfront_origin_access_identity.origin_access_identity.s3_canonical_user_id}"
      },
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::www.${var.site_name}/*"
    }
  ]
}
EOF

  logging {
    target_bucket = "${aws_s3_bucket.logs.bucket}"
    target_prefix = "www.${var.site_name}/"
  }

  website {
    index_document = "index.html"
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "cloudfront origin access identity"
}

resource "aws_cloudfront_distribution" "website_cdn" {
  enabled      = true
  price_class  = "PriceClass_200"
  http_version = "http1.1"
  aliases = ["${var.site_name}"]

  origin {
    origin_id   = "origin-bucket-${aws_s3_bucket.www_site.id}"
    domain_name = "www.${var.site_name}.s3.eu-west-2.amazonaws.com"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path}"
    }
  }

  origin {
    origin_id   = "football-backend-origin"
    domain_name = aws_alb.main.dns_name
    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port = "80"
      https_port = "443"
      origin_ssl_protocols = ["TLSv1"]
    }
  }

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"] # make sure I don't send the backend calls through CF
    cached_methods  = ["GET", "HEAD"]
    target_origin_id = "origin-bucket-${aws_s3_bucket.www_site.id}"

    min_ttl          = "0"
    default_ttl      = "300"                                              //3600
    max_ttl          = "1200"                                             //86400

    // This redirects any HTTP request to HTTPS. Security first!
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "football-backend-origin"

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 1
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "${var.cloudfront_cert_arn}"
    ssl_support_method       = "sni-only"
  }
}

#point godaddy to the name below
#resource "aws_route53_record" "www_site" {
#  zone_id = "${data.aws_route53_zone.site.zone_id}"
#  name = "www.${var.site_name}"
#  type = "A"
#  alias {
#    name = "${aws_cloudfront_distribution.website_cdn.domain_name}"
#    zone_id  = "${aws_cloudfront_distribution.website_cdn.hosted_zone_id}"
#    evaluate_target_health = false
#  }
#}