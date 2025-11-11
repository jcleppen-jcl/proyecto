// encadenamiento opcional "?."

const data1 = null;
console.log(data1?.id);

const data2 = null;
console.log(data2.id);


// --------------------------------------

// Detalle                         SQL                          NoSQL
// Tipo de base de datos           Relacional                   No Relacional (documentos JSON)
// Unidad                          Fila (Row)                   Documento dentro de una coleccion
// Comando                         UPDATE tabla                 updateDoc(ref, {campo: valor})  
//                                 SET campo = valor
//                                 WHERE id = x
// Identificador                   id numerico,                 doc.id(string unico generado por Firestore)
//                                 clave primaria
// Transaccion                     Modifica el bloque           Modifica campos dentro de un documento
// Validacion                      WHERE                        Debemos verificar manualmente con getDoc() antes de updateDoc()  
// Operacion parcial               Requiere listar todos los    updateDoc solo cambia los campos que mandamos
//                                 campos si se usa UPDATE
//                                 completo.
// Retorno                         No devuelve el registro      Debemos leer el documento actualizado ( getDoc() )
//                                 actualizado


// Resumen:
// SQL ->   UPDATE se ejecuta directamente en la tabla filtrando por WHERE

// NoSQL
//  1.- Obtener una referencia al documenteo -> doc()
//  2.- Verificar la existencia -> getDoc()
//  3.- Hacer la actualizacion -> updateDoc()
//  4.- Volver a leer -> getDoc() - para obtener los datos nuevos.

