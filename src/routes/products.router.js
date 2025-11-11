// ================================
//  MÓDULO DE RUTAS DE PRODUCTOS
// ================================

// Importamos la función Router desde Express.
// Router nos permite crear un conjunto de rutas manejadas de forma modular,
// separando la lógica por recursos (en este caso, productos).
import { Router } from 'express'; // Desestructuramos Router de Express 

// Importamos *todas* las funciones exportadas desde el controlador de productos.
// El " * as controller " agrupa todas las exportaciones en un único objeto llamado "controller",
// lo que nos permite acceder a cada función como controller.nombreFuncion.
import * as controller from '../controllers/products.controller.js';

// Creamos una instancia del enrutador de Express.
// Este objeto 'router' nos permite definir rutas específicas para este módulo.
const router = Router(); // Es una instancia del Router

/////////////////////////////////////////////////////////////

// Importamos el MIDDLEWARE de AUTENTICACION
import { auth } from "../middleware/auth.middleware.js" // OJO cambio la ruta con respecto al index.js

// ================================
//  DEFINICIÓN DE RUTAS DE PRODUCTOS
// ================================

/// Rutas GET ///

// Definimos una ruta para obtener todos los productos.
// Cuando se hace una solicitud GET a '/api/products', se ejecuta controller.getAllProducts.

router.get('/', controller.getAllProducts); // cuando alguien haga un GET a /api/products va a ejecutar getAllProducts

// Definimos una ruta para buscar productos por nombre u otros parámetros.
// Ejemplo de uso: GET /api/products/search?name=xxxx
// Se usa query params (req.query) para realizar búsquedas dinámicas.

router.get('/search', controller.searchProduct); // cuando alguien haga un GET a /api/products/search va a ejecutar searchProduct

// Definimos una ruta para obtener un producto por su ID.
// Ejemplo: GET /api/products/5
// ':id' indica un parámetro de ruta, accesible desde req.params.id.

router.get('/:id', controller.getProductById); // cuando alguien haga un GET a /api/products/:id va a ejecutar getProductById

/// Rutas POST ///

// Definimos una ruta para crear un nuevo producto.
// Cuando se envía una solicitud POST a '/api/products',
// los datos del producto vienen en el cuerpo (req.body).

router.post('/', auth, controller.createProduct); // cuando alguien haga un POST a /api/products va a ejecutar createProduct

/// Rutas PUT ///

// Definimos una ruta para actualizar un producto existente según su ID.
// Se usa el método PUT, que semánticamente representa una actualización completa del recurso.
// Ejemplo: PUT /api/products/3

router.put('/:id', auth, controller.updateProduct); // cuando alguien haga un PUT a /api/products/:id va a ejecutar updateProduct

/// Rutas DELETE ///

// Definimos una ruta para eliminar un producto por su ID.
// El método DELETE se utiliza para remover recursos del sistema.
// Ejemplo: DELETE /api/products/3

router.delete('/:id', auth, controller.deleteProduct); // cuando alguien haga un DELETE a /api/products/:id va a ejecutar deleteProduct


// ================================

// Exportamos el enrutador para poder usarlo en otros módulos (por ejemplo, en index.js).
// Lo exportamos como "default" porque queremos importar este módulo con un nombre personalizado, 
// porque afuera de este modulo la quiero llamar de alguna manera particular
// sin necesidad de usar llaves ({}).
export default router;

// La otra forma de exportar es la nombrada, cuando colocamos un nombre en vez de default.
// despues debe ser importada con este nombre que se asigno.
// export const Hola = () => {} . Esto es una exportacion nombrada.