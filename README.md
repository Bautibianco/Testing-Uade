# FocusU - PWA para Organización Académica

Una aplicación web progresiva (PWA) para organizar exámenes, trabajos prácticos y recordatorios de clases.

## Características

- 🔐 Autenticación segura con JWT
- 📅 Calendario mensual con eventos por tipo
- 📱 PWA con soporte offline
- 🎨 Interfaz moderna con Tailwind CSS
- 🚀 Arquitectura monorepo con Node/Express + React

## Estructura del Proyecto

```
focusu/
├── server/          # Backend Node/Express
├── web/            # Frontend React/Vite
└── package.json    # Scripts del monorepo
```

## Instalación y Ejecución

### Prerrequisitos

- Node.js 18+
- npm o yarn
- MongoDB Atlas (opcional - funciona en memoria sin configuración)

### Pasos de Instalación

1. **Instalar dependencias globales (si no están instaladas):**
   ```bash
   npm i -g concurrently
   ```

2. **Instalar todas las dependencias:**
   ```bash
   npm run install:all
   ```

3. **Configuración opcional de MongoDB:**
   
   Crear archivo `.env` en `server/`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/focusu
   JWT_SECRET=tu_jwt_secret_super_seguro
   CORS_ORIGIN=http://localhost:5173
   PORT=3001
   ```
   
   **Nota:** Si no configuras MongoDB, la app funcionará en modo memoria para pruebas.

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir la aplicación:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Uso

1. **Registro/Login:** Crea una cuenta o inicia sesión
2. **Crear Eventos:** Usa el botón "+ Nuevo evento" para agregar exámenes, entregas o clases
3. **Ver Calendario:** Navega por los meses y haz clic en los días para ver eventos
4. **Gestionar:** Elimina eventos que ya no necesites

## Tipos de Eventos

- 🔴 **EXAM** - Exámenes (rojo)
- 🟡 **DELIVERY** - Trabajos prácticos (ámbar)
- 🔵 **CLASS** - Clases/recordatorios (azul)

## Tecnologías

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcrypt para hash de contraseñas
- Helmet para seguridad

### Frontend
- React + Vite
- React Router
- Tailwind CSS
- date-fns para manejo de fechas
- PWA con Service Worker

## API Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/logout` - Cerrar sesión

### Eventos
- `GET /events?from=YYYY-MM-DD&to=YYYY-MM-DD` - Listar eventos
- `POST /events` - Crear evento
- `DELETE /events/:id` - Eliminar evento
- `PUT /events/:id` - Editar evento (V2)

## Desarrollo

### Scripts Disponibles

- `npm run dev` - Ejecutar frontend y backend en paralelo
- `npm run install:all` - Instalar todas las dependencias

### Estructura de Carpetas

#### Server (`server/`)
```
src/
├── index.ts              # Punto de entrada
├── config/
│   └── env.ts           # Configuración de variables
├── controllers/         # Controladores de rutas
├── middlewares/         # Middleware personalizado
├── models/             # Modelos de Mongoose
├── repositories/       # Repositorios (MongoDB/Memoria)
└── routes/            # Definición de rutas
```

#### Web (`web/`)
```
src/
├── main.tsx            # Punto de entrada React
├── App.tsx             # Componente principal
├── components/         # Componentes reutilizables
├── pages/             # Páginas de la aplicación
├── hooks/             # Custom hooks
└── utils/             # Utilidades
```

## Versiones Futuras

### V2 (Próxima)
- Edición de eventos existentes
- Mejoras en la UI/UX

### V3 (Futuro)
- Sistema de recordatorios
- Notificaciones push
- Sincronización offline

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
