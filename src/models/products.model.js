// Importo la conexión a Firestore (tu archivo data.js debe exportar 'db').
import { db } from './data.js'; // Conexion a la base de datos que la hicimos en el data.js

// Importo funciones necesarias de Firebase Firestore para operar con documentos y colecciones.
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";

// collection: para referenciar una colección, 
//             ¿que es una colección de documentos? es como una tabla en bases de datos relacionales que agrupa documentos similares.

// doc: para referenciar un documento específico

// getDoc: para obtener un solo documento
 
// getDocs: para obtener múltiples documentos de una colección
//           ¿que es un documento? es una unidad individual de datos dentro de una colección, similar a una fila en una tabla relacional.


// addDoc: para agregar un nuevo documento con ID autogenerado
// deleteDoc: para eliminar un documento
// setDoc: para crear o sobrescribir un documento con ID específico

// updateDoc: para actualizar campos específicos de un documento


// import { error } from "console"; // no es necesario importar error desde consola

// Referencia a la colección "products" en Firestore.
const productsCollection = collection(db, "products"); 

// 'db' es la instancia de Firestore importada desde data.js
// "products" es el nombre de la colección donde se almacenan los productos.
// Cada documento dentro de esta colección representará un producto individual.


/////////////////////////////////////////////////////////////////

// Obtiene todos los productos desde Firestore.
export const getAllProducts = async () => {
    try {
        // Obtengo todos los documentos de la colección.
        const snapshot = await getDocs(productsCollection); // snapshot es como una "foto" del estado actual
        // Mapeo cada doc a un objeto con id y sus datos.
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // retorna array de objetos
    } catch (error) {
        // Si hay error lo muestro en consola y retorno un array vacío para no romper la app.
        console.error('getAllProducts error:', error);
        return []; // retorno defensivo en caso de error
    }
};

/////////////////////////////////////////////////////////////////

// Obtiene un producto por su id (document id en Firestore).
export const getProductById = async (id) => {
    try {
        // Construyo la referencia al documento dentro de la colección.
        const productRef = doc(productsCollection, id);
        // Obtengo el snapshot del documento.
        const snapshot = await getDoc(productRef);
        // Si existe, retorno un objeto con id y datos; si no, retorno null.
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        // Logeo el error y retorno null (indicando que no se encontró/ocurrió error).
        console.error('getProductById error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

// Función asincrónica que crea un nuevo producto en Firestore
export const createProduct = async (data) => { // "data" contiene los campos del producto (name, price, cantidad) a guardar
    try {
        // VALIDACIÓN BÁSICA DEL OBJETO RECIBIDO
        // Compruebo que "data" exista y sea un objeto válido antes de intentar guardarlo
        if (!data || typeof data !== 'object') { // si no existe data o no es un objeto
            throw new Error('Los datos del producto no son válidos'); // Si falla, lanzo un error
        }

        // INSERCIÓN EN FIRESTORE
        // addDoc agrega un nuevo documento a la colección "productsCollection"
        // Firestore genera automáticamente un ID único para este documento
        const docRef = await addDoc(productsCollection, data); // Espero a que se complete la operación, obteniendo una referencia al nuevo documento

        // RESPUESTA AL CONTROLADOR
        // Devuelvo un objeto con el ID asignado y los datos que se guardaron
        return { id: docRef.id, ...data }; // Retorno el nuevo producto con su ID y los datos, SPREAD operator, copia las propiedades de "data" en el nuevo objeto

    } catch (error) {
        // MANEJO DE ERRORES
        // Si ocurre algún error durante la creación, lo registro en la consola para depuración
        console.error('createProduct error:', error); // Log del error en consola

        // Re-lanzo el error para que el controlador (controller) lo capture y devuelva un 500
        throw new Error('Error al crear el producto en la base de datos'); // El controller manejará este error
    }
};


/////////////////////////////////////////////////////////////////

export const updateProduct = async (id, productData) => {
  try {

    // Referencia tentativa por doc id
    let productRef = doc(productsCollection, id); // doc es una función de Firestore que crea una referencia a un documento específico dentro de una colección. 
                                                  // La referencia se basa en el ID del documento proporcionado y la colección a la que pertenece. Pero aun no 
                                                  // obtenemos el snapshot o los datos del doc.
    let snapshot = await getDoc(productRef); // getDoc obtiene el snapshot (estado) del documento referenciado. Es un objeto que contiene los datos y 
                                             // metadatos (.exists(), .id) del documento en Firestore.

    // Si no existe un doc con ese doc.id, pasa a intentar otra estrategia de busqueda: por campo 'id' dentro de los datos de los documentos, NO en el doc.id (referencia)

    if (!snapshot.exists()) {
      console.warn(`Model -> updateProduct: no existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

      // Tomo todos los docs 
      const allSnapshot = await getDocs(productsCollection);

      // Busco un documento cuyo campo 'id' coincida (uso el operador "=="" para cubrir número vs string (por ejemplo "3" vs 3))

      const found = allSnapshot.docs.find(d => { // cada elemento d representa un documento de Firestore.
            const data = d.data();               // d.data() devuelve un objeto con los datos del documento ({id: 3, name: "Mouse", price: 1000 })
            // Comparo tanto string como número
            return data?.id == id || data?.id == Number(id); // Usa encadenamiento opcional (?.) para evitar errores si data es undefined o null.
                                                             // Si data existe, devuelve su propiedad id. Si data NO existe, devuelve undefined sin lanzar error
                                                             // Es una forma segura de acceder a propiedades.
            // Primero compara si data.id es igual a id tal cual viene.
            // Si eso no da true, intenta convertir el id a número (Number(id)) y vuelve a comparar.
            // En otras palabras:
            // “Considerá que el documento coincide si su id es igual al id recibido ya sea como string o como número.”
      });


      if (!found) { 
        console.warn(`Model -> updateProduct: no se encontró documento con campo 'id' == ${id}`);
        return false; // indicar al controller que no existe
      }

      // Si lo encontré, actualizo productRef y snapshot para seguir el flujo
      // o sea crea una nueva referencia usando el found.id real (el ID interno del documento).
      // recupera el snapshot de ese documento correcto.

      productRef = doc(productsCollection, found.id);
      snapshot = await getDoc(productRef);
      console.log(`Model -> updateProduct: document encontrado por campo 'id' -> doc.id='${found.id}'`);
    }

    // Ahora actualizamos (updateDoc actualiza solo campos provistos en productData). NO reemplaza todo el documento.
    // updateDoc es el equivalente al UPDATE en SQL

    await updateDoc(productRef, productData);

    // Obtener el documento actualizado para devolverlo (con doc.id correcto)
    // Vuelve a leer el documento actualizado para confirmar los nuevos valores.
    // Combina el ID interno (updateSnapshot.id) con los datos (updatedSnaphot.data())

    const updatedSnapshot = await getDoc(productRef); // getDoc obtiene el snapshot (estado) del documento referenciado.
    const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

    console.log("Model -> updateProduct: producto actualizado correctamente:", updatedData);
    return updatedData;

  } catch (error) {
    console.error("Model -> updateProduct error:", error);
    return null;
  }
};

/////////////////////////////////////////////////////////////////

// Elimina un producto por id. Devuelve true si se eliminó, false si no existe.
export const deleteProduct = async (id) => {
    try {
        // Referencia al documento.
        const productRef = doc(productsCollection, id); // doc crea una referencia a un documento específico dentro de una colección.
        // ¿que es una referencia a un documento? Es un puntero o enlace que identifica de manera única un documento dentro de una colección en Firestore.
        // ¿para qué sirve una referencia a un documento? Sirve para realizar operaciones como leer, escribir, actualizar o eliminar ese documento específico en la base de datos.
        // La referencia se basa en el ID del documento proporcionado y la colección a la que pertenece.
        // La referencia en sí no contiene los datos del documento; es simplemente un identificador que apunta a la ubicación del documento en la base de datos.
        // Obtengo el snapshot del documento para verificar si existe.

        // Verifico si existe primero.
        const snapshot = await getDoc(productRef); // getDoc obtiene el documento referenciado por productRef.
        
        // snapshot es una instantanea o foto del doc
        console.log('deleteProduct - snapshot.id:', snapshot.id); 
        console.log('deleteProduct - snapshot.exists():', snapshot.exists());
        console.log('deleteProduct - snapshot.data():', snapshot.data());

        // Si no existe, retorno false.
        if (!snapshot.exists()) {
            // return false;
            return { deleted: false, message: 'Producto no encontrado' };
        }

        // Si existe, lo elimino.
        await deleteDoc(productRef); // elimino el doc de Firestore
      
        //return true; // eliminado exitosamente
        
        // Devuelvo los datos del producto eliminado
        //return snapshot.data(); // retorno los datos del producto eliminado

        // Si todo sale bien, retorno true indicando éxito y los datos del producto eliminado
        return { deleted: true, data: snapshot.data() };
        
    } catch (error) {
        // Log en caso de error y retorno false para indicar fallo.
        console.error('deleteProduct error:', error);
        return false;
    }
};

/////////////////////////////////////////////////////////////////

