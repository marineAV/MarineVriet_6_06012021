# PROJET 6 – Création d’une API sécurisée

L’objectif étant pour les utilisateurs de poster leurs sauces piquantes préférées et d’évaluer celle des autres grâce à un système de like et dislike.

## Installation

Cloner ce projet depuis GitHub.
Exécuter npm install pour installer les dépendances.
Exécuter npm install node-sass pour installer sass.
      
	Lancer le Frontend :

      - Démarrer ng serve.
      - Rendez-vous sur http://localhost:4200.
      
	Lancer le Backend :

      - Installez le package nodemon : npm install -g nodemon.
      - Puis lancez le serveur: nodemon server.

Enfin, l’utilisateur devra s’inscrire sur l’application en fournissant un e-mail et un mot de passe.
Le mot de passe devra avoir au moins 7 caractères, devra contenir des minuscules, des majuscules, deux chiffres, sans espaces.

## Technologies utilisées

- Node.js
- Express
- MongoDB

## Sécurité OWASP et RGPD

1. Attaques par injection noSql : installation et importation d’ express-mongo-sanitize afin de prévenir des attaques par injection en nettoyant correctement les données d’entrées.

2. Authentification : Utilisation des packages email-validator et password-validator pour exiger des utilsateurs, de choisir un mot de passe fort et éviter le piratage des identifiants de connection, par exemple par la technique de force brute.

3. Protection des données sensibles : Utilisation des variables d’environnement avec dotenv, les données sensibles sont remplacés par des variables d’environnement dans le code.

Puis utilisation du hachage et salage du mot de passe qui consiste à le transformer en une chaine crypté avec le package Bcrypt.

4. Attaques XSS : Le package helmet nous permet de protéger les données qui transite à travers les en-têtes http.

5. Contrôle d’accès : Utilisation d’un Token/Jeton avec JWT afin de permettre l’authentification d’un utilisateur à l’aide d’un jeton (token) signé .