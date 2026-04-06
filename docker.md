# 1. Build l'image
docker build (-t backend_project) . <== must be in lowercase
# autre:
docker build --no-cache -t backend_project .

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

# 5. Lancer docker-compose
docker-compose up -d

# Voir les logs des deux services
docker-compose logs -f

# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (perd les données de la DB)
docker-compose down -v

# Exécuter une commande dans le conteneur backend
docker exec -it backend_app sh

# Voir les ressources utilisées
docker stats



# #######################################

# Se connecter à PostgreSQL depuis votre conteneur
docker exec -it backend_postgres psql -U your_user -d your_database

# Ou depuis votre application
docker exec -it backend_app sh
# Puis à l'intérieur du conteneur:
node -e "const { Client } = require('pg'); const client = new Client({ host: 'postgres', port: 5432, user: 'your_user', password: 'your_password', database: 'your_database' }); client.connect().then(() => console.log('DB Connected!')).catch(e => console.error(e));"