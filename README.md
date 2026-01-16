# ✈️ Sistema de Gestión de Aerolínea

Sistema completo de reservas y gestión de vuelos con arquitectura de capas, autenticación JWT, pasarelas de pago (Stripe/MercadoPago), y gestión de asientos en tiempo real.

---

## � Colaboradores

Este proyecto fue desarrollado en colaboración por:

- **Daniel Ortiz** - [@DaniOrtiz248](https://github.com/DaniOrtiz248) - danielsolano248@gmail.com
- **Sofia Jaramillo** - [@SofiaJara](https://github.com/SofiaJara) - sofi.171025@gmail.com
- **Brayan Stiven Valencia** - [@BrayanStiven45](https://github.com/BrayanStiven45) - bravalen45@gmail.com
- **Luis Felipe Garzón Bonilla** - luis.garzon@utp.edu.co

---

## �📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [API Endpoints](#-api-endpoints)
- [Pasarelas de Pago](#-pasarelas-de-pago)
- [Colaboradores](#-colaboradores)

---

## ✨ Características

### Frontend (Next.js 15)
- 🎨 Interfaz moderna con **Tailwind CSS 4.0**
- 🔐 Sistema de autenticación con JWT
- 🎫 Búsqueda y reserva de vuelos
- 💺 Selección interactiva de asientos
- 💳 Integración con Stripe y MercadoPago
- 📧 Confirmaciones por correo electrónico
- 👤 Panel de administración
- 🌍 Gestión de zonas horarias

### Backend (Node.js + Express)
- 🏗️ Arquitectura en capas (Controller → Service → Repository)
- 🔒 Autenticación JWT con middleware
- 📊 Base de datos MySQL con Sequelize ORM
- ✅ Validación de datos con Zod
- 📧 Envío de emails con Nodemailer
- 🖼️ Procesamiento de imágenes con Sharp
- 🔄 API RESTful completa
- 🌐 CORS configurado

---

## 🛠️ Tecnologías

### Frontend
```json
{
  "framework": "Next.js 15.5.2",
  "react": "19.1.0",
  "styling": "Tailwind CSS 4.0",
  "payments": ["Stripe", "MercadoPago"],
  "utils": ["country-state-city"]
}
```

### Backend
```json
{
  "runtime": "Node.js",
  "framework": "Express 5.1.0",
  "database": "MySQL 2 (mysql2)",
  "orm": "Sequelize 6.37.7",
  "auth": "JWT (jsonwebtoken)",
  "validation": "Zod 4.1.9",
  "security": "bcryptjs",
  "email": "Nodemailer 7.0.6"
}
```

---

## 🏗️ Arquitectura

### Flujo de Datos (Clean Architecture)

```
┌─────────────┐     HTTP      ┌──────────────┐
│  Frontend   │ ───────────>  │  Controller  │  ← Recibe request, valida entrada
│  (Next.js)  │               │              │
└─────────────┘               └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Service    │  ← Lógica de negocio
                              │              │
                              └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Repository  │  ← Acceso a datos
                              │              │
                              └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Database   │  ← MySQL + Sequelize
                              │    (MySQL)   │
                              └──────────────┘
```

### Estructura del Proyecto

```
SistemaAerolinea/
├── backend_aerolinea/
│   ├── src/
│   │   ├── controllers/     # Controladores HTTP
│   │   ├── services/        # Lógica de negocio
│   │   ├── repositories/    # Acceso a datos
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Definición de rutas
│   │   ├── middleware/      # Autenticación, CORS, etc.
│   │   ├── schema/          # Validaciones Zod
│   │   ├── config/          # Configuraciones
│   │   └── app.js           # Punto de entrada
│   └── package.json
│
└── frontend_aereolinea/
    ├── src/
    │   ├── app/
    │   │   ├── flights/     # Páginas de vuelos
    │   │   ├── payment/     # Flujos de pago
    │   │   ├── services/    # Servicios API
    │   │   └── hooks/       # Custom hooks
    │   └── utils/           # Utilidades
    └── package.json
```

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18.x
- MySQL >= 8.0
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone https://github.com/DaniOrtiz248/SistemaAerolinea-Academico.git
cd SistemaAerolinea-Academico
```

### 2. Configurar Backend

```bash
cd backend_aerolinea
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar Frontend

```bash
cd frontend_aereolinea
npm install

# Crear archivo .env.local
cp .env.example .env.local
# Editar .env.local con tus claves
```

---

## ⚙️ Configuración

### Backend (.env)

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=aerolinea_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_super_seguro

# Email (Nodemailer)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_app

# Servidor
PORT=3000
```

### Frontend (.env.local)

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_TU_CLAVE_PUBLICA
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA

# MercadoPago
NEXT_PUBLIC_MP_PUBLIC_KEY=tu_public_key
MP_ACCESS_TOKEN=tu_access_token
```

---

## 🚀 Ejecutar el Proyecto

### Backend

```bash
cd backend_aerolinea
npm run dev        # Con nodemon
# o
npm run start:dev  # Con node --watch
```

El servidor estará en `http://localhost:3000`

### Frontend

```bash
cd frontend_aereolinea
npm run dev
```

La aplicación estará en `http://localhost:3001`

---

## 📡 API Endpoints

### Autenticación
```http
POST   /api/usuarios/register      # Registrar usuario
POST   /api/usuarios/login          # Login
POST   /api/usuarios/logout         # Logout
```

### Vuelos
```http
GET    /api/vuelos                  # Listar vuelos
GET    /api/vuelos/search           # Buscar vuelos
GET    /api/vuelos/:ccv             # Obtener vuelo por ID
POST   /api/vuelos                  # Crear vuelo [Auth]
```

### Reservas
```http
POST   /api/reservas                # Crear reserva [Auth]
GET    /api/reservas/:id            # Obtener reserva [Auth]
PUT    /api/reservas/:id            # Actualizar reserva [Auth]
DELETE /api/reservas/:id            # Cancelar reserva [Auth]
```

### Asientos
```http
GET    /api/asientos/:vueloId       # Obtener asientos de vuelo [Auth]
PUT    /api/asientos/:id            # Actualizar asiento [Auth]
```

### Pagos
```http
POST   /api/compras                 # Procesar compra [Auth]
GET    /api/compras/:id             # Obtener compra [Auth]
```

### Ciudades y Rutas
```http
GET    /api/ciudades                # Listar ciudades
GET    /api/rutas                   # Listar rutas
```

> **Nota**: Endpoints marcados con `[Auth]` requieren JWT token en headers:
> ```
> Authorization: Bearer <token>
> ```

---

## 💳 Pasarelas de Pago

### Stripe Integration

El sistema soporta pagos con Stripe en **modo de prueba**. Ver documentación completa en:
- [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)
- [STRIPE_TEST_CARDS.md](./STRIPE_TEST_CARDS.md)
- [TESTING_STRIPE.md](./TESTING_STRIPE.md)

#### Tarjeta de Prueba Principal
```
Número:  4242 4242 4242 4242
Fecha:   12/34
CVC:     123
```

### MercadoPago Integration

Ver configuración completa en [MERCADOPAGO_SETUP.md](./MERCADOPAGO_SETUP.md)

---

## 📊 Base de Datos

### Modelos Principales

- **Usuario** - Gestión de usuarios y autenticación
- **UsuarioPerfil** - Información personal del usuario
- **Vuelo** - Información de vuelos
- **Ruta** - Rutas aéreas entre ciudades
- **Ciudad** - Ciudades disponibles
- **Asiento** - Asientos por vuelo
- **Reserva** - Reservas de vuelos
- **Compra** - Transacciones de pago
- **Tiquete** - Boletos generados
- **Viajero** - Información de pasajeros
- **InfoTarjeta** - Datos de tarjetas

---

## 🧪 Testing

### Backend
```bash
# Ver archivos .http en backend_aerolinea/pruebas/
# Usar con extensión REST Client de VSCode
```

### Frontend
```bash
npm run lint    # Validar código
npm run build   # Compilar para producción
```

---

## 📝 Ejemplo de Registro de Usuario

### Request Body
```json
{
  "usuario": {
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
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agregar mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

---

## 📞 Soporte

Si tienes preguntas o encuentras problemas, puedes contactar a cualquiera de los colaboradores listados arriba.

---

**Desarrollado con ❤️ por el equipo de SistemaAerolinea**
