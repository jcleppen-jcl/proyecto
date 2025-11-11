
// FORMATEO DE CLIENTE DE SALIDA
// Esto asegura consistencia: aunque tu base de datos guarde dni y celular como string, el cliente siempre recibirá números.

export const formatClientOutput = (client) => {
  if (!client) return client; // si es null o undefined, retorno tal cual
  const out = { ...client }; // clono el objeto para no mutar el original
  if (out.dni != null) out.dni = Number(out.dni); // convierto a número si no es null o undefined
  if (out.celular != null) out.celular = Number(out.celular); // convierto a número si no es null o undefined
  return out; // retorno el objeto formateado
};

////////////////////////////////////////////////////////////////////////////////////////////////////

// VALIDACIÓN SENCILLA DE CLIENTE
export const validateClientData = (data) => { // Función que recibe los datos del cliente
  const errors = []; // Array donde se guardarán los mensajes de error encontrados

  // Verifico si se recibió algún dato
  if (!data) {
    errors.push('No se proporcionó data del cliente'); // Agrego un mensaje de error si el body está vacío
    return { valid: false, errors }; // Retorno inmediato indicando que no es válido
  }

  // Validación del campo "name"
  // Debe ser un string y no puede estar vacío
  if (typeof data.name !== 'string' || data.name.trim().length < 1) {
    errors.push('El campo "name" es obligatorio y debe ser un string no vacío');
  }

  // Validación del campo "dni"
  // Debe existir y ser un número (convertible con Number)
  if (data.dni == null || isNaN(Number(data.dni))) {
    errors.push('El campo "dni" es obligatorio y debe ser numérico');
  }

  // Validación del campo "celular"
  // Debe existir y ser un número (convertible con Number)
  if (data.celular == null || isNaN(Number(data.celular))) {
    errors.push('El campo "celular" es obligatorio y debe ser numérico');
  }

  // Devuelvo un objeto con:
  //  - valid: true, si no hay errores
  //  - errors: lista de errores encontrados (vacía si es válido)
  return { valid: errors.length === 0, errors };
};


