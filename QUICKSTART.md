# 🚀 FocusU - Inicio Rápido

## Instalación y Ejecución

### Opción 1: Script Automático (Recomendado)
```bash
node setup.js
npm run dev
```

### Opción 2: Instalación Manual
```bash
# 1. Instalar concurrently globalmente
npm install -g concurrently

# 2. Instalar dependencias
npm run install:all

# 3. Ejecutar en modo desarrollo
npm run dev
```

## Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Uso Básico

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Crear Eventos**: Usa el botón "+ Nuevo evento"
3. **Ver Calendario**: Navega por los meses y haz clic en los días
4. **Gestionar**: Elimina eventos que ya no necesites

## Tipos de Eventos

- 🔴 **EXAM** - Exámenes
- 🟡 **DELIVERY** - Trabajos prácticos  
- 🔵 **CLASS** - Clases/recordatorios

## Configuración Opcional

### MongoDB Atlas (Opcional)
Si quieres usar MongoDB en lugar del modo memoria:

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito
3. Obtén la URI de conexión
4. Edita `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/focusu
   ```

### Variables de Entorno
El archivo `server/.env` contiene:
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=
```

## Características PWA

- ✅ Instalable en dispositivos móviles
- ✅ Funciona offline (con cache)
- ✅ Notificaciones push (V3)
- ✅ Sincronización automática

## Solución de Problemas

### Error de Puerto en Uso
```bash
# Cambiar puerto del servidor
echo "PORT=3002" >> server/.env
```

### Error de Dependencias
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules server/node_modules web/node_modules
npm run install:all
```

### Error de CORS
Verifica que `CORS_ORIGIN` en `server/.env` sea `http://localhost:5173`

## Comandos Útiles

```bash
# Desarrollo completo
npm run dev

# Solo backend
npm run dev --prefix server

# Solo frontend  
npm run dev --prefix web

# Build de producción
npm run build --prefix web
```

## Estructura del Proyecto

```
focusu/
├── server/          # Backend Node/Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── repositories/
│   └── package.json
├── web/            # Frontend React/Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── package.json
└── package.json    # Scripts del monorepo
```

## Próximas Versiones

### V2 (Próxima)
- Edición de eventos existentes
- Mejoras en la UI/UX

### V3 (Futuro)
- Sistema de recordatorios
- Notificaciones push
- Sincronización offline avanzada

---

¡Disfruta usando FocusU! 🎓
