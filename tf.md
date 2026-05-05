aws configure
cd TF/
ls -la
terraform init
# Vérifiez d'abord si AWS CLI est configuré
aws sts get-caller-identity

terraform plan

terraform apply
http://100.31.40.101

terraform destroy

# 1. Aller dans le dossier TF
cd ~/OneDrive/Bureau/optiManage/backend_project/TF

# 2. Recréer l'infrastructure
terraform apply