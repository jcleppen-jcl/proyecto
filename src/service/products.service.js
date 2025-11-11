
// FORMATEO DE PRODUCTO DE SALIDA
// Esto asegura consistencia: aunque tu base de datos guarde price y cantidad como string, el cliente siempre recibirá números.

export const formatProductOutput = (product) => {
  if (!product) return product; // si es null o undefined, retorno tal cual
  const out = { ...product }; // clono el objeto para no mutar el original
  if (out.price != null) out.price = Number(out.price); // convierto a número si no es null o undefined
  if (out.cantidad != null) out.cantidad = Number(out.cantidad); // convierto a número si no es null o undefined
  return out; // retorno el objeto formateado
};

////////////////////////////////////////////////////////////////////////////////////////////////////

// VALIDACIÓN SENCILLA DE PRODUCTO
export const validateProductData = (data) => { // Función que recibe los datos del producto
  const errors = []; // Array donde se guardarán los mensajes de error encontrados

  // Verifico si se recibió algún dato
  if (!data) {
    errors.push('No se proporcionó data del producto'); // Agrego un mensaje de error si el body está vacío
    return { valid: false, errors }; // Retorno inmediato indicando que no es válido
  }

  // Validación del campo "name"
  // Debe ser un string y no puede estar vacío
  if (typeof data.name !== 'string' || data.name.trim().length < 1) {
    errors.push('El campo "name" es obligatorio y debe ser un string no vacío');
  }

  // Validación del campo "price"
  // Debe existir y ser un número (convertible con Number)
  if (data.price == null || isNaN(Number(data.price))) {
    errors.push('El campo "price" es obligatorio y debe ser numérico');
  }

  // Validación del campo "cantidad"
  // Debe existir y ser un número (convertible con Number)
  if (data.cantidad == null || isNaN(Number(data.cantidad))) {
    errors.push('El campo "cantidad" es obligatorio y debe ser numérico');
  }

  // Devuelvo un objeto con:
  //  - valid: true, si no hay errores
  //  - errors: lista de errores encontrados (vacía si es válido)
  return { valid: errors.length === 0, errors };
};


