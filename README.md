# SistemaAerolinea
Repositorio de un sistema de gestión de aerolínea

## 👥 Colaboradores

Este proyecto fue desarrollado en colaboración por:

- **Daniel Ortiz** - [@DaniOrtiz248](https://github.com/DaniOrtiz248) - danielsolano248@gmail.com
- **Sofia Jaramillo** - [@SofiaJara](https://github.com/SofiaJara) - sofi.171025@gmail.com
- **Brayan Stiven Valencia** - [@BrayanStiven45](https://github.com/BrayanStiven45) - bravalen45@gmail.com
- **Luis Felipe Garzón Bonilla** - luis.garzon@utp.edu.co

## 📋 Descripción

Flujo de datos entre capas

Ejemplo de cómo viaja un request:

Frontend → hace un request HTTP (ej: POST /usuarios).

Controller → recibe la petición, valida datos básicos.

Service → aplica reglas de negocio (ej: verificar que el correo no esté repetido).

Repository → consulta en la base de datos.

Database → responde.

Respuesta → vuelve hacia arriba hasta el frontend.

# Estructura para hacer el registro de usuario enviando un aplication/json desde el front a la api

{
  "usuario":{
    "descripcion_usuario": "Nuevo Usuario",
    "correo_electronico": "nuevo@usuario.com",
    "contrasena": "123456",
    "id_rol": 1
  },
  "usuarioPerfil": {
    "dni_usuario": "12345678",
    "primer_nombre": "Nuevo",
    "segundo_nombre": "Usuario",
    "primer_apellido": "Apellido1",
    "segundo_apellido": "Apellido2",
    "fecha_nacimiento": "1990-01-01",
    "lugar_nacimiento": "Ciudad",
    "direccion_facturacion": "Direccion 123",
    "id_genero_usuario": 1
  }
}
