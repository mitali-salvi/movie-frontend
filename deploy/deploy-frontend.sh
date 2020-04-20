# kubectl create namespace ui
kubectl apply -f frontend-service-account.yaml -n ui
kubectl apply -f deployment.yaml -n ui
kubectl expose deployment frontend -n ui --type=LoadBalancer --port 80 --target-port 8080