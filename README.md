# FORMOTEX 

Sistema de gestión de inventario de equipos informáticos desarrollado con TypeScript, Express y MongoDB.Utilizando patrones de diseño y programación orientada objetos.


### Características
* Autenticación JWT con roles de usuario (admin/user)
* CRUD completo de equipos informáticos
* Validaciones robustas con express-validator
* Sistema de roles y permisos
* Manejode errores
* Tipado estricto con TypeScript

### Tecnologías
* Backend: Node.js + Express + TypeScript
* Base de Datos: MongoDB con Mongoose
* Autenticación: JWT (JSON Web Tokens)
* Seguridad: bcryptjs para encriptación
* Validaciones: express-validator
* Variables de Entorno: dotenv

### Cómo clonar el repositorio

1. Clonar el repositorio

```bash
git clone https://github.com/tatymediina/tp-equipos-informaticos.git
```

2.  Ubicarse en la carpeta del proyecto
```bash 
cd tp-equipos-informaticos
```

3. Instalar dependencias
```bash
npm install
```
### Variables de entorno

```bash
PORT=3402
MONGO_URI=mongodb://127.0.0.01:27017/EquipmentInventory
JWT_SECRET=MY_SECRET
```
### Scripts disponibles
```bash
{
  "dev": "tsx --watch src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js"
}
```

### Iniciar el proyecto
```bash
npm run dev
```

### Decisiones Tecnicas

#### 1. Diseño de relaciones entre entidades

* Un usuario puede tener múltiples equipos asignados
* Un equipo puede estar asignado a un solo usuario
* Relación implementada con referencia por ObjectId de MongoDB
* Populación automática en consultas para obtener datos del usuario

Justificación: Esta relación uno-a-muchos permite un control granular de asignaciones y facilita consultas como "equipos por usuario".

#### 2. Organización de Carpetas

**Arquitectura por Capas:**

* Controllers: Manejan requests/responses HTTP
* Services: Contienen lógica de negocio
* Models: Definen esquemas de base de datos
* Middleware: Funciones reutilizables para autenticación y validación

Ventajas:
* Separación clara de responsabilidades
* Código más mantenible y testeable
* Facilita el trabajo en equipo

####  3. Propiedades de Entidades

Usuario:

* email: Identificador único, validado
* role: Control de acceso (admin/user)
* isActive: Soft delete para mantener integridad referencial

Equipo Informático:
* serialNumber: Identificador único del equipo físico
* specifications: Objeto flexible para diferentes tipos de hardware
* status: Flujo de vida del equipo (available → in_use → maintenance → retired)

#### 4. Elección de Librerías y Patrones

MongoDB con Mongoose:
Flexibilidad para esquemas evolutivos
Validaciones a nivel de base de datos

JWT para Autenticación:
Fácil implementación con middlewares

express-validator:
Validaciones declarativas y reutilizable

patron singleton:
Asegurar una sola instancia.