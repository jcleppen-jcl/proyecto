import * as service from "../service/products.service.js";
import * as model from "../models/products.model.js";

/////////////////////////////////////////////////////////////

// exportacion nombrada, si o si vamos a tener que llamar de esta manera a la funcion despues
export const getAllProducts = async (req, res) => { 
  // Llama al modelo para obtener todos los productos y responde con JSON.
  // Uso await porque model.getAllProducts es async (devuelve una promesa).
  res.json(await model.getAllProducts());
};

/////////////////////////////////////////////////////////////

export const searchProduct = async (req, res) => {
    // Obtengo el parámetro 'name' desde los query params (ej: /products/search?name=lap)
    const { name } = req.query; // Desestructuración de objetos: extrae la propiedad 'name'

    // Si no viene el query param 'name' devolvemos un 400 Bad Request.
    if (!name || typeof name !== 'string' || name.trim() === '') {
        // 400: el cliente no proporcionó el parámetro necesario o está vacío.
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        // getAllProducts es async — debemos esperar la promesa.
        const products = await model.getAllProducts();

        // Si por alguna razón no recibimos un array, defensivamente respondemos con 500.
        if (!Array.isArray(products)) {
            return res.status(500).json({ error: 'Error interno al obtener productos' });
        }

        // Filtramos los productos por nombre (case-insensitive).
        const filteredProducts = products.filter((product) =>
            // Comprobación defensiva: product.name puede ser undefined en algún documento corrupto.
            typeof product.name === 'string' &&
            product.name.toLowerCase().includes(name.toLowerCase())
        );

        // Log de debugging (opcional). Muestra los query params recibidos.
        console.log('searchProduct - query:', req.query);

        // Respondo con los productos filtrados.

        if (!products || filteredProducts.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            return res.json(service.formatProductOutput(filteredProducts));
        };


    } catch (error) {
        // Capturo errores inesperados y respondo 500.
        console.error('searchProduct error:', error);
        return res.status(500).json({ error: 'Error interno al buscar productos' });
    }
};

/////////////////////////////////////////////////////////////

export const getProductById = async (req, res) => {
    // Obtengo el id desde los params de la ruta (ej: /products/:id)
    const { id } = req.params; // Desestructuración de objetos: extrae la propiedad 'id'

    try {
        // Llamo al modelo para obtener el producto por id (async).
        const product = await model.getProductById(id);

        // Si no existe, devuelvo 404 Not Found.
        console.log('getProductById - result:', product); // Si el producto no existe, product será null
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Si existe, devolverlo en JSON.
        return res.json(product);

    } catch (error) {
        // En caso de error interno, registro y devuelvo 500.
        console.error('getProductById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener producto' });
    }
};

/////////////////////////////////////////////////////////////

// Controlador que maneja la creación de un nuevo producto
export const createProduct = async (req, res) => { // Función asíncrona exportada (para poder usar await)

    // Llamo a la función de validación del servicio, paso los datos del body
    // Desestructuro el resultado para obtener las variables "valid" y "errors"
    const { valid, errors } = service.validateProductData(req.body);

    // Si la validación no es correcta (valid = false)
    if (!valid) {
        // Devuelvo un error 400 (Bad Request) con los mensajes de error
        return res.status(400).json({ errors });
    };

    // Extraigo los campos esperados del body del request
    const { name, price, cantidad } = req.body; // Desestructuración para obtener solo los datos necesarios

    try {
        // Llamo al modelo para crear el producto en la base de datos (o archivo)
        // Uso await porque model.createProduct devuelve una promesa
        const newProduct = await model.createProduct({ name, price, cantidad }); // Paso los datos al modelo

        // Si todo sale bien, devuelvo una respuesta 201 (Created) con el nuevo producto
        return res.status(201).json(newProduct);

    } catch (error) { // Captura de errores (por ejemplo, si falla el acceso a la base de datos)
        console.error('createProduct error:', error); // Muestra el error en consola para depuración

        // Devuelvo un error 500 (Internal Server Error) al cliente con un mensaje genérico
        return res.status(500).json({ error: 'Error interno al crear producto' });
    }
};


///////////////////////////////////////////////////////////////

export const updateProduct = async (req, res) => {
    // Obtengo el id desde los params y los datos a actualizar desde el body.
    const { id } = req.params; // id del producto a actualizar
    const productData = req.body; // objeto con los campos a actualizar

    console.log('Controller -> updateProduct - id:', id, 'data:', productData);

    // Validaciones básicas:
    if (!id) { // si no hay id - undefined, null, '', 0, false, cadena vacía, NaN.
        return res.status(400).json({ error: 'Controller -> Se requiere el id del producto en la ruta' });
    }
    if (!productData || typeof productData !== 'object' || Array.isArray(productData)) { // si no hay body(productData) o no es un objeto válido (typeof) o es un array. 
                                                                                         // Se espera un objeto con los campos a actualizar.
        return res.status(400).json({ error: 'Controller -> Se requiere un body con los datos a actualizar' });
    }

    try {
        // Llamo al modelo para actualizar (retorna false si no existe).
        const updated = await model.updateProduct(id, productData);

        // Si no existe el producto, devuelvo 404.
        if (!updated) {
            return res.status(404).json({ error: 'Controller -> Producto NO encontrado !!!!' });
        }

        // Si se actualizó correctamente, devuelvo el producto actualizado.
        return res.status(200).json(updated);

    } catch (error) {
        // Manejo de errores inesperados.
        console.error('Controller -> updateProduct error:', error);
        return res.status(500).json({ error: 'Controller -> Error interno al actualizar producto' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteProduct = async (req, res) => { // Ruta para eliminar el producto

    const { id } = req.params; // Desestructuración: obtengo el id desde params
    console.log('Controller - deleteProduct - id:', id);

    try {
        // Llamo al modelo para eliminar el producto.
        const deleted = await model.deleteProduct(id); // reemplacé productId por id

        // Si deleteProduct devolvió false, el producto no existía.
        if (!deleted) { // si es false o null lo niego para conseguir un TRUE
            return res.status(404).json({ error: 'Producto NO encontrado' });
        } else {
            return res.status(200).json(deleted); // devuelvo los datos del producto eliminado. 200 es OK  
        }

        // 204 No Content: eliminado con éxito (sin cuerpo).
        // return res.status(204).send(); // 204 es el código de estado para la eliminación exitosa


    } catch (error) {
        // Error inesperado durante la eliminación.
        console.error('deleteProduct error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar producto' });
    }
};

/////////////////////////////////////////////////////////////