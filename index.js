//importar modulos
const app = require('./app');
const http = require('http');

// Crear un servidor HTTP
//http.createServer (es un metodo de la libreria http): crea un servidor HTTP que escucha las peticiones del cliente
const server = http.createServer(app);
const PORT = 3000;

// Iniciar el servidor
server.listen(PORT, () => {
    console.log('El servidor esta corriendo');
});
