# SistemaAerolinea
Repositorio de un sistema de gestión de aerolínea

Flujo de datos entre capas

Ejemplo de cómo viaja un request:

Frontend → hace un request HTTP (ej: POST /usuarios).

Controller → recibe la petición, valida datos básicos.

Service → aplica reglas de negocio (ej: verificar que el correo no esté repetido).

Repository → consulta en la base de datos.

Database → responde.

Respuesta → vuelve hacia arriba hasta el frontend.
