aws2 ecr create-repository --repository-name football-repo --region eu-west-2
aws2 ecs create-cluster --region eu-west-2 --cluster-name FootballCluster
aws2 ecs register-task-definition \
	    --cli-input-json file://$PWD/football-backend/task-def.json
aws2 ecs create-service --region eu-west-2 --cluster FootballCluster \
	--service-name FootballService \
	--desired-count 1 \
	--task-definition football-server:1 \
	--launch-type "FARGATE" \
	--network-configuration "awsvpcConfiguration={subnets=[subnet-3ff72173],securityGroups=[sg-0a22fe473c22306fb]}"
