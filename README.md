# 🥫RecogeLatas

**RecogeLatas** es una aplicación web que permite a los estudiantes registrar, visualizar y organizar la recolección de latas en una campaña escolar del 4C generación 2025. En la aplicación en cuestión, cada estudiante tiene su propio perfil, donde registra la cantidad de latas que va recolectando, obteniendo estadísticas suyas y del grupo al que pertenece, además de un posicionamiento automático en el ranking del curso, en función de las latas que vaya recolectando.

## 📁 Estructura del proyecto

```plaintext
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   │   └── collectController.js
│   │   └── groupController.js
│   │   └── logController.js
│   │   └── monitorController.js
│   │   └── userController.js
│   ├── routes/
│   │   └── authRoutes.js
│   │   └── collectRoutes.js
│   │   └── groupRoutes.js
│   │   └── logRoutes.js
│   │   └── monitorRoutes.js
│   │   └── userRoutes.js
│   ├── config/
│   │   └── db.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── profile.html
│   ├── styles/
│   │   └── login.css
│   │   └── profile.css
│   ├── js/
│   │   └── api.js
│   │   └── login.js
│   │   └── profile.js
│   │   └── register.js
│   │   └── swiper.js
└── README.md
```
## 🚀 Funcionalidades principales

- Registro de usuarios a partir de un listado preexistente en la base de datos (con asignación de nickname y contraseña).
- Inicio y cierre de sesión con cookies y JWT.
- Visualización del perfil del usuario y su progreso.
- Muestra del total de latas recolectadas por todos los participantes.
- Interfaz clara y amigable para usuarios jóvenes.
- Ranking de grupo y general, para fomentar la recolección a partir de la competitividad.
- Estadísticas del usuario en comparación a su grupo con gráficos integrados.

## 🛠️ Tecnologías utilizadas
### Backend
- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- Bcrypt.js
- dotenv
### Frontend
- HTML
- CSS
- JavaScript (vanilla)
### Herramientas adicionales

- pg-promise o pg: Conector para PostgreSQL
- CORS: Middleware para manejo de CORS
- cookie-parser: Manejo de cookies
- Swiper.js: Para sliders en el frontend

## 🧩 Instalación y Uso
Sigue estos pasos para ejecutar el proyecto de manera local:
### 1. Clona el repositorio

```bash
git clone https://github.com/tuusuario/tu-repo.git
```
### 2. Instala las dependencias del backend
```bash
cd backend
npm install
```
### 3. Configura las variables de entorno
Crea un archivo .env dentro de la carpeta backend/ con el siguiente contenido
```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_de_tu_base_de_datos
JWT_SECRET=una_clave_secreta_para_los_tokens
NODE_ENV=development
```
### 4. Ejecuta el servidor backend
```bash
node server.js
```
### 5. Abre el frontend
Navega a la carpeta frontend/ y abre el archivo `index.html` con tu navegador.
> Asegúrate de tener tu base de datos PostgreSQL en ejecución antes de iniciar el servidor.
## 🗄️ Estructura de la Base de Datos

Este proyecto utiliza PostgreSQL como sistema de gestión de base de datos. A continuación se describe la estructura de las tablas utilizadas:

### Tabla `users`

| Columna     | Tipo    | Restricciones                              |
|-------------|---------|--------------------------------------------|
| id          | integer | PRIMARY KEY, NOT NULL                      |
| name        | text    | NOT NULL                                   |
| nickname    | text    | ÚNICO (UNIQUE), puede ser NULL             |
| password    | text    | Puede ser NULL                             |
| total_cans  | integer | DEFAULT 0                                  |
| group_id    | integer | FOREIGN KEY → groups(id), puede ser NULL   |

**Relaciones**:
- Un usuario puede pertenecer a un grupo (`group_id`).
- Un usuario puede tener muchas entradas en `collects` y `logs`.

---

### Tabla `groups`

| Columna     | Tipo    | Restricciones             |
|-------------|---------|---------------------------|
| id          | integer | PRIMARY KEY, NOT NULL     |
| name        | text    | NOT NULL                  |
| description | text    | Puede ser NULL            |

**Relaciones**:
- Un grupo puede tener muchos usuarios.

---

### Tabla `collects`

| Columna  | Tipo      | Restricciones                                          |
|----------|-----------|--------------------------------------------------------|
| id       | integer   | PRIMARY KEY, NOT NULL                                  |
| user_id  | integer   | FOREIGN KEY → users(id), puede ser NULL                |
| amount   | integer   | NOT NULL                                               |
| date     | timestamp | DEFAULT CURRENT_TIMESTAMP                              |
| log_id   | integer   | FOREIGN KEY → logs(id), puede ser NULL, ON DELETE CASCADE |

**Relaciones**:
- Cada recolección pertenece a un usuario.
- Puede estar vinculada a un log.

---

### Tabla `logs`

| Columna   | Tipo      | Restricciones                                       |
|-----------|-----------|-----------------------------------------------------|
| id        | integer   | PRIMARY KEY, NOT NULL                               |
| user_id   | integer   | FOREIGN KEY → users(id), puede ser NULL, ON DELETE CASCADE |
| action    | text      | NOT NULL                                            |
| timestamp | timestamp | DEFAULT CURRENT_TIMESTAMP                           |

**Relaciones**:
- Un log pertenece a un usuario.
- Un log puede estar vinculado a múltiples entradas en `collects`.

---

> ⚠️ Recuerda ejecutar las migraciones o crear estas tablas manualmente antes de iniciar el backend.
## 🌐 Despliegue (opcional)

El proyecto puede desplegarse en plataformas como Vercel (frontend) y Render o Railway (backend). Asegúrate de configurar correctamente las variables de entorno.

## ✍️ Autor
**José Garrillo** - Ssj400 

## 📌 Estado del proyecto
- ✅ Proyecto terminado
- 🔒 Modo solo lectura
- 🌱 Apto para ser desplegado o integrado en una campaña escolar real.
