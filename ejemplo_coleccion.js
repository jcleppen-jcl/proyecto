[{
  "usuarios": {
    "usuario_001": {
      "nombre": "Ana García",                   // String
      "edad": 28,                               // Number (integer)
      "activo": true,                           // Boolean
      "fecha_registro": "2025-10-28T14:30:00Z", // Timestamp
      "ubicacion": {                            // GeoPoint
        "latitude": 19.4326,
        "longitude": -99.1332
      },
      "preferencias": {                         // Map (objeto anidado)
        "tema": "oscuro",
        "notificaciones": true
      },
      "hobbies": [                              // Array (lista)
        "leer",
        "viajar",
        "fotografía"
      ],
      "amigos": [                               // Array con referencias
        { "ref": "usuarios/usuario_002" },
        { "ref": "usuarios/usuario_003" }
      ],
      "biografia": null                         // Null
    },

    "usuario_002": {
      "nombre": "Carlos López",
      "edad": 32,
      "activo": false,
      "fecha_registro": "2024-06-15T09:00:00Z",
      "ubicacion": {
        "latitude": 40.4168,
        "longitude": -3.7038
      },
      "preferencias": {
        "tema": "claro",
        "notificaciones": false
      },
      "hobbies": ["ciclismo", "videojuegos"],
      "amigos": [
        { "ref": "usuarios/usuario_001" }
      ],
      "biografia": "Apasionado por la tecnología y el deporte."
    }
  }
}]

// Explicación
// Cada documento (usuario_001, usuario_002) representa un usuario.
// Dentro de cada documento hay campos con distintos tipos de datos.
// Los campos anidados (como preferencias) son Mapas.
// Las listas (hobbies, amigos) son Arrays.
// Las referencias ({ "ref": "usuarios/usuario_002" }) permiten conectar documentos entre sí.