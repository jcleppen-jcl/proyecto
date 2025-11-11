// ================================
//  MÓDULO DE RUTAS DE CLIENTES
// ================================

// Importamos la función Router desde Express.
// Router nos permite crear un conjunto de rutas manejadas de forma modular,
// separando la lógica por recursos (en este caso, clientes).
import { Router } from 'express'; // Desestructuramos Router de Express 

// Importamos *todas* las funciones exportadas desde el controlador de clients.
// El " * as controller " agrupa todas las exportaciones en un único objeto llamado "controller",
// lo que nos permite acceder a cada función como controller.nombreFuncion.
import * as controller from '../controllers/clients.controller.js';

// Creamos una instancia del enrutador de Express.
// Este objeto 'router' nos permite definir rutas específicas para este módulo.
const router = Router(); // Es una instancia del Router

/////////////////////////////////////////////////////////////

// ================================
//  DEFINICIÓN DE RUTAS DE CLIENTES
// ================================

/// Rutas GET ///

// Definimos una ruta para obtener todos los clientes.
// Cuando se hace una solicitud GET a '/api/clients', se ejecuta controller.getAllClients.

router.get('/', controller.getAllClients); // cuando alguien haga un GET a /api/clients va a ejecutar getAllClients

// Definimos una ruta para buscar clientes por nombre u otros parámetros.
// Ejemplo de uso: GET /api/clients/search?name=xxxx
// Se usa query params (req.query) para realizar búsquedas dinámicas.

router.get('/search', controller.searchClient); // cuando alguien haga un GET a /api/clients/search va a ejecutar searchClient

// Definimos una ruta para obtener un cliente por su ID.
// Ejemplo: GET /api/clients/5
// ':id' indica un parámetro de ruta, accesible desde req.params.id.

router.get('/:id', controller.getClientById); // cuando alguien haga un GET a /api/clients/:id va a ejecutar getClientById

/// Rutas POST ///

// Definimos una ruta para crear un nuevo cliente.
// Cuando se envía una solicitud POST a '/api/clients',
// los datos del cliente vienen en el cuerpo (req.body).

router.post('/', controller.createClient); // cuando alguien haga un POST a /api/clients va a ejecutar createClient

/// Rutas PUT ///

// Definimos una ruta para actualizar un cliente existente según su ID.
// Se usa el método PUT, que semánticamente representa una actualización completa del recurso.
// Ejemplo: PUT /api/clients/3

router.put('/:id', controller.updateClient); // cuando alguien haga un PUT a /api/clients/:id va a ejecutar updateClient

/// Rutas DELETE ///

// Definimos una ruta para eliminar un cliente por su ID.
// El método DELETE se utiliza para remover recursos del sistema.
// Ejemplo: DELETE /api/clients/3

router.delete('/:id', controller.deleteClient); // cuando alguien haga un DELETE a /api/clients/:id va a ejecutar deleteClient


// ================================

// Exportamos el enrutador para poder usarlo en otros módulos (por ejemplo, en index.js).
// Lo exportamos como "default" porque queremos importar este módulo con un nombre personalizado, 
// porque afuera de este modulo la quiero llamar de alguna manera particular
// sin necesidad de usar llaves ({}).
export default router;

// La otra forma de exportar es la nombrada, cuando colocamos un nombre en vez de default.
// despues debe ser importada con este nombre que se asigno.
// export const Hola = () => {} . Esto es una exportacion nombrada.