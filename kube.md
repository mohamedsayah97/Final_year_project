# lancer minikube
minikube start

minikube status
# check your cluster is running
kubectl cluster-info

kubectl get nodes

kubectl apply -f k8s/backend-config.yaml
kubectl apply -f k8s/grafana-deployement.yaml
kubectl apply -f k8s/prometheus-deployement.yaml
kubectl apply -f k8s/backend-deployement.yaml

minikube tunnel

minikube dashboard