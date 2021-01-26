const http = require('http');
const app = require('./app');

// Configuration du port de connection********************************
const normalizePort = val => {
  const port = parseInt(val, 10); // Convertit la valeur en entier

  if (isNaN(port)) {  // Vérifie si la valeur n'est pas un nombre
    return val;
  }
  if (port >= 0) {    // Vérifie si la valeur du port est valide
    return port;
  }
  return false;       // Sinon faux
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // On dit à l'application sur quel 'port' elle va tourner + argument port qui à été configuré

// Fonction de gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // Création du serveur qui renvoi les requêtes vers app

// Écouteur d'évènements
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // port = 3000 (l.16)
