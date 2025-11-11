import * as service from "../service/clients.service.js";
import * as model from "../models/clients.model.js";

/////////////////////////////////////////////////////////////

// exportacion nombrada, si o si vamos a tener que llamar de esta manera a la funcion despues
export const getAllClients = async (req, res) => { 
  // Llama al modelo para obtener todos los clientes y responde con JSON.
  // Uso await porque model.getAllClients es async (devuelve una promesa).
  res.json(await model.getAllClients());
};

/////////////////////////////////////////////////////////////

export const searchClient = async (req, res) => {
    // Obtengo el parámetro 'name' desde los query params (ej: /clients/search?name=lap)
    const { name } = req.query; // Desestructuración de objetos: extrae la propiedad 'name'

    // Si no viene el query param 'name' devolvemos un 400 Bad Request.
    if (!name || typeof name !== 'string' || name.trim() === '') {
        // 400: el cliente no proporcionó el parámetro necesario o está vacío.
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        // getAllClients es async — debemos esperar la promesa.
        const clients = await model.getAllClients();

        // Si por alguna razón no recibimos un array, defensivamente respondemos con 500.
        if (!Array.isArray(clients)) {
            return res.status(500).json({ error: 'Error interno al obtener clientes' });
        }

        // Filtramos los clientes por nombre (case-insensitive).
        const filteredClients = clients.filter((client) =>
            // Comprobación defensiva: client.name puede ser undefined en algún documento corrupto.
            typeof client.name === 'string' &&
            client.name.toLowerCase().includes(name.toLowerCase())
        );

        // Log de debugging (opcional). Muestra los query params recibidos.
        console.log('searchClient - query:', req.query);

        // Respondo con los clientes filtrados.

        if (!clients || filteredClients.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            return res.json(service.formatClientOutput(filteredClients));
        };


    } catch (error) {
        // Capturo errores inesperados y respondo 500.
        console.error('searchClient error:', error);
        return res.status(500).json({ error: 'Error interno al buscar clientes' });
    }
};

/////////////////////////////////////////////////////////////

export const getClientById = async (req, res) => {
    // Obtengo el id desde los params de la ruta (ej: /clients/:id)
    const { id } = req.params; // Desestructuración de objetos: extrae la propiedad 'id'

    try {
        // Llamo al modelo para obtener el cliente por id (async).
        const client = await model.getClientById(id);

        // Si no existe, devuelvo 404 Not Found.
        console.log('getClientById - result:', client); // Si el cliente no existe, client será null
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Si existe, devolverlo en JSON.
        return res.json(client);

    } catch (error) {
        // En caso de error interno, registro y devuelvo 500.
        console.error('getClientById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener cliente' });
    }
};

/////////////////////////////////////////////////////////////

// Controlador que maneja la creación de un nuevo cliente
export const createClient = async (req, res) => { // Función asíncrona exportada (para poder usar await)

    // Llamo a la función de validación del servicio, paso los datos del body
    // Desestructuro el resultado para obtener las variables "valid" y "errors"
    const {valid, errors} = service.validateClientData(req.body);

    // Si la validación no es correcta (valid = false)
    if (!valid) {
        // Devuelvo un error 400 (Bad Request) con los mensajes de error
        return res.status(400).json({ errors });
    };

    // Extraigo los campos esperados del body del request
    const { name, dni, celular } = req.body; // Desestructuración para obtener solo los datos necesarios

    try {
        // Llamo al modelo para crear el cliente en la base de datos (o archivo)
        // Uso await porque model.createClient devuelve una promesa
        const newClient = await model.createClient({ name, dni, celular }); // Paso los datos al modelo

        // Si todo sale bien, devuelvo una respuesta 201 (Created) con el nuevo cliente
        return res.status(201).json(newClient);

    } catch (error) { // Captura de errores (por ejemplo, si falla el acceso a la base de datos)
        console.error('createClient error:', error); // Muestra el error en consola para depuración

        // Devuelvo un error 500 (Internal Server Error) al cliente con un mensaje genérico
        return res.status(500).json({ error: 'Error interno al crear cliente' });
    }
};


///////////////////////////////////////////////////////////////

export const updateClient = async (req, res) => {
    // Obtengo el id desde los params y los datos a actualizar desde el body.
    const { id } = req.params; // id del cliente a actualizar
    const clientData = req.body; // objeto con los campos a actualizar

    console.log('Controller -> updateClient - id:', id, 'data:', clientData);

    // Validaciones básicas:
    if (!id) { // si no hay id - undefined, null, '', 0, false, cadena vacía, NaN.
        return res.status(400).json({ error: 'Controller -> Se requiere el id del cliente en la ruta' });
    }
    if (!clientData || typeof clientData !== 'object' || Array.isArray(clientData)) { // si no hay body(clientData) o no es un objeto válido (typeof) o es un array. 
                                                                                         // Se espera un objeto con los campos a actualizar.
        return res.status(400).json({ error: 'Controller -> Se requiere un body con los datos a actualizar' });
    }

    try {
        // Llamo al modelo para actualizar (retorna false si no existe).
        const updated = await model.updateClient(id, clientData);

        // Si no existe el cliente, devuelvo 404.
        if (!updated) {
            return res.status(404).json({ error: 'Controller -> Cliente NO encontrado !!!!' });
        }

        // Si se actualizó correctamente, devuelvo el cliente actualizado.
        return res.status(200).json(updated);

    } catch (error) {
        // Manejo de errores inesperados.
        console.error('Controller -> updateClient error:', error);
        return res.status(500).json({ error: 'Controller -> Error interno al actualizar cliente' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteClient = async (req, res) => { // Ruta para eliminar el cliente

    const { id } = req.params; // Desestructuración: obtengo el id desde params
    console.log('Controller - deleteClient - id:', id);

    try {
        // Llamo al modelo para eliminar el cliente.
        const deleted = await model.deleteClient(id); // reemplacé clientId por id

        // Si deleteClient devolvió false, el cliente no existía.
        if (!deleted) { // si es false o null lo niego para conseguir un TRUE
            return res.status(404).json({ error: 'Cliente NO encontrado' });
        } else {
            return res.status(200).json(deleted); // devuelvo los datos del cliente eliminado. 200 es OK  
        }

        // 204 No Content: eliminado con éxito (sin cuerpo).
        // return res.status(204).send(); // 204 es el código de estado para la eliminación exitosa


    } catch (error) {
        // Error inesperado durante la eliminación.
        console.error('deleteClient error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar cliente' });
    }
};

/////////////////////////////////////////////////////////////