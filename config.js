// Configuración de la URL de la página según el entorno
const PAGE_URL = process.env.NODE_ENV === 'production'
    ? 'placeholder'
    : 'http://localhost:3000'

    
// Configuración de la URL de la página
module.exports = { PAGE_URL };