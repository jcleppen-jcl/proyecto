//=======================================================
// index.js — Punto de entrada principal del servidor Node.js con Express
//=======================================================

// Importamos el módulo 'express' que nos permite crear un servidor HTTP de forma sencilla
import express from 'express';

// Importamos 'cors' para permitir solicitudes desde distintos orígenes (dominios diferentes)
import cors from 'cors';

// Importamos 'dotenv/config' para poder usar variables de entorno definidas en un archivo .env
// Esto nos permite mantener configuraciones (como el puerto) fuera del código fuente
import 'dotenv/config';


// ======================================================
// CONFIGURACIÓN INICIAL DEL SERVIDOR
// ======================================================

// Creamos una instancia de la aplicación Express; este objeto es nuestro servidor
const app = express();

// ======================================================
// VARIABLES DE ENTORNO
// ======================================================
// console.log("=> TODAS LAS VARIABLE ENV:", process.env); // Muestra todas las variables de entorno disponibles

console.log("=> PORT:", process.env.PORT); // Muestra la variable de entorno PORT si está definida 
console.log("=> NODE_ENV:", process.env.NODE_ENV); // Muestra el entorno actual (development, production, etc.)

// Definimos el puerto en el que correrá el servidor
// Si existe la variable de entorno PORT, la usamos; si no, por defecto será 3000
const PORT = process.env.PORT || 3001;

//=======================================================
// #### ///     MIDDLEWARE de MANTENIMIENTO      /// #### 
// ======================================================

// Sirve para cualquier metodo (GET, POST, PUT, DELETE, etc). 
// Next no lo voy a usar, pero es necesario ponerlo.
// Dos ejemplos de como hacerlo:

// Descomentar para activar el modo mantenimiento 1

// app.use((req, res, next) => { 
//   res.json({mensaje: 'API en Mantenimiento !!!'});
// });

// Descomentar para activar el modo mantenimiento 2

// app.use((req, res, next) => { 
//   res.status(503).json({error: 'API en Mantenimiento !!!'});
// });

// ======================================================
// MIDDLEWARES GLOBALES
// ======================================================

// Habilita CORS (Cross-Origin Resource Sharing), permitiendo que otros dominios (p. ej. un frontend React) accedan a nuestra API
app.use(cors());

// Middleware que permite a Express interpretar automáticamente cuerpos de solicitud en formato JSON
// Sin esto, no podríamos acceder a req.body en las peticiones POST o PUT
app.use(express.json());


//=======================================================
//  MIDDLEWARE DE REGISTRO GENERAL
//=======================================================
// Se ejecuta *antes* de cualquier ruta
app.use((req, res, next) => {
  const timestamp = new Date().toISOString(); // Fecha y hora actual en formato ISO - legible. Si comentamos esta linea genera un error, en donde se usa timestamp mas abajo.
  console.log("\n========= NUEVA PETICIÓN =========");
  console.log("=> Fecha:", timestamp);
  console.log("=> Método:", req.method);         // GET, POST, PUT, DELETE, etc.
  console.log("=> URL original:", req.originalUrl); // La URL completa pedida
  //console.log("=> Cabeceras:", req.headers);     // Info enviada por el cliente
  console.log("=> content-type:", req.headers['content-type'] || 'No especificado');
  console.log("==================================\n");
  next(); // Continua al siguiente middleware o ruta
});

// ======================================================
// RUTAS PRINCIPALES
// ======================================================

// Definimos una ruta GET en la raíz ("/") que responde con un mensaje de bienvenida
// Esto sirve como endpoint de prueba para confirmar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST en Node.js funcionando correctamente desde la URL: /' });
});


//=======================================================
// IMPORTACION DE RUTAS - Todas las rutas relacionadas con AUTENTICACION
// ======================================================

// Importamos el MIDDLEWARE de AUTENTICACION
// import { auth } from './src/middleware/auth.middleware.js'; // NO LO COLOCO ACA A AUTH LO LLEVO A LA RUTA DEL PRODUCTO, ESTA ES OTRA OPCION

// Importamos el enrutador de la autenticacion, donde definimos las rutas relacionadas con "auth"
import authRouter from './src/routes/auth.router.js';

// Asignamos el router de productos al prefijo '/api/products'
// Esto significa que todas las rutas dentro de auth.router.js comenzarán con ese prefijo

// app.use('/api/auth', authRouter);
app.use('/api/auth', authRouter); // NO COLOCAR ACA EL AUTH ANTES DEL AUTHROUTER porque estaria diciendo que el login tiene que esta autorizado.

//=======================================================
// IMPORTACION DE RUTAS - Todas las rutas relacionadas con "products"
// ======================================================

// Importamos el enrutador de productos, donde definimos las rutas relacionadas con "products"
// Usamos rutas separadas para mantener el código modular y organizado
import productsRouter from './src/routes/products.router.js';

// Asignamos el router de productos al prefijo '/api/products'
// Esto significa que todas las rutas dentro de products.router.js comenzarán con ese prefijo

app.use('/api/products', productsRouter);
// app.use('/api/products', auth, productsRouter); // NO LO COLOCO ACA A AUTH LO LLEVO A LA RUTA DEL PRODUCTO, ESTA ES OTRA OPCION


//=======================================================
// IMPORTACION DE RUTAS - Todas las rutas relacionadas con "clients"
// ======================================================

// Importamos el enrutador de clients, donde definimos las rutas relacionadas con "clients"
// Usamos rutas separadas para mantener el código modular y organizado
import clientsRouter from './src/routes/clients.router.js';

// Asignamos el router de clients al prefijo '/api/clients'
// Esto significa que todas las rutas dentro de clients.router.js comenzarán con ese prefijo
app.use('/api/clients', clientsRouter);

//=======================================================
// ******************************************************
//=======================================================


//=======================================================
//  RUTA DE EJEMPLO EXITOSA
//=======================================================
app.get("/saludo", (req, res) => {
  // Express genera automáticamente `req` y `res`
  // `req` contiene información sobre la solicitud del cliente
  // `res` se usa para responder al cliente
  res.json({ mensaje: "*** ¡Hola! Esta ruta funciona correctamente ***" });
});

//=======================================================
//  RUTA CON ERROR CONTROLADO
//=======================================================
app.get("/error", (req, res) => {
  // Generamos un error intencional para ver cómo lo maneja Express
  throw new Error("<<< SIM >>> Error simulado en /error <<< SIM >>>");
});


// =======================================================
// MIDDLEWARE - 404 (RUTA NO ENCONTRADA)
// =======================================================

// Este middleware se ejecuta si ninguna de las rutas anteriores fue encontrada
// Maneja errores de tipo "No encontrado" (404) para cualquier método (GET, POST, etc.)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'MIDDLE: Ruta NO encontrada', // Mensaje de error genérico
    ruta: req.originalUrl // Muestra la ruta que el cliente intentó acceder, originalUrl es una propiedad del req, 
                          // contiene la Url que el cliente intento acceder. Incluye el path y los parámetros (pero no el dominio ni el protocolo).
  });
});


// =======================================================
// MIDDLEWARE - MANEJADOR GLOBAL DE ERRORES
// =======================================================

// Middleware especial para capturar y manejar errores internos del servidor
// Evita que el servidor se caiga ante un error inesperado y devuelve una respuesta JSON controlada
app.use((err, req, res, next) => {

  //console.error('Error interno:', err.stack); // Muestra el error completo en consola para depuración
  console.log("=> Se capturó un error en el middleware global:");
  console.log("=> Mensaje:", err.message);
  console.log("=> Stack:", err.stack);  // En desarrollo, muestra el stack trace completo, no recomendado en producción
  // que es el stack trace? El stack trace es una representación detallada de la secuencia de llamadas de funciones que llevaron a un error en un programa.

  // Respondemos con código 500 (Internal Server Error) y detalles del error
  // En desarrollo mostramos detalles; en producción, no.
  const response = {
    error: '<<< INT >>> Error interno del servidor <<< INT >>>',
    mensaje: err.message,
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  // Muestra el mensaje del error que causó la excepción en nuestro caso el mensaje es "<<< SIM >>> Error simulado en /error <<< SIM >>>" (ver ruta /error arriba)
  // No es recomendable enviar el stack trace al cliente en producción por razones de seguridad
  // pero para desarrollo puede ser útil.
  // detalle: err.stack  

  res.status(500).json(response);  

});

//=======================================================
// ******************************************************
//=======================================================



// =======================================================
// INICIO DEL SERVIDOR
// =======================================================

// Iniciamos el servidor para que escuche en el puerto definido
// La función de callback se ejecuta una vez que el servidor está en marcha
app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`)});

//=======================================================
// FIN DE index.js
