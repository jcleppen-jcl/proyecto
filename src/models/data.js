// Importa las funciones que necesitas de los SDK que necesitas

import { initializeApp } from "firebase/app"; // SDK principal de Firebase

import { getFirestore } from "firebase/firestore"; // SDK de Firestore

// ¿que es un SDK?
// Un SDK (Software Development Kit) es un conjunto de herramientas, bibliotecas, documentación y ejemplos de código
// que los desarrolladores pueden utilizar para crear aplicaciones específicas para una plataforma o servicio determinado.
// En este caso, los SDKs de Firebase proporcionan las herramientas necesarias para interactuar con los servicios de Firebase,
// como Firestore, Authentication, Storage, entre otros.

// TODO: Agregar SDK para los productos de Firebase que desea utilizar
// https://firebase.google.com/docs/web/setup#available-libraries

// La configuración de Firebase en nuestra aplicación web
const firebaseConfig = {
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
