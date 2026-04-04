# 1. Build l'image
docker build (-t backend_project) . <== must be in lowercase

Commande	Utilité
docker ps	/Voir les conteneurs actifs
docker ps -a	/Voir tous les conteneurs (actifs + arrêtés)
docker images	/Voir les images installées
docker image ls	/Alternative à docker images
docker container ls	/Alternative à docker ps
docker stop <id>	/Arrêter un conteneur
docker rm <id>	/Supprimer un conteneur arrêté
docker rmi <image>	/Supprimer une image

Commande	Description
docker ps	/Voir les conteneurs actifs
docker logs backend_app	/Voir les logs
docker stop backend_app	/Arrêter le conteneur
docker start backend_app	/Redémarrer un conteneur arrêté
docker restart backend_app	/Redémarrer
docker exec -it backend_app sh	/Ouvrir un shell dans le conteneur
docker rm -f backend_app	/Supprimer le conteneur (force)

# 2. Lancer votre conteneur 
docker run -d -p 3000:3000 --name backend_app backend_project

# 3. Vérifier que le conteneur tourne
docker ps

# 4. Voir les logs de l'application
docker logs backend_app