// Configuración de la URL de la página según el entorno
const PAGE_URL = process.env.NODE_ENV === 'production'
    ? 'https://proyecto-todoapp-8zit.onrender.com'
    : 'http://localhost:3000'



    const MONGO_URI = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_TEST
    
// Configuración de la URL de la página
module.exports = { PAGE_URL, MONGO_URI };
