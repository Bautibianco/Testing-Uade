# Pruebas E2E - Sistema de Calendario Académico

Pruebas automatizadas End-to-End usando Selenium para el sistema de gestión de eventos académicos.

## 📋 Descripción

Este proyecto contiene casos de prueba automatizados para validar las 7 historias de usuario del sistema:

- **HU-01**: Registro de Usuario
- **HU-02**: Inicio de sesión
- **HU-03**: Crear evento académico
- **HU-04**: Visualización de calendario mensual
- **HU-05**: Eliminar evento
- **HU-06**: Navegación en la interfaz
- **HU-07**: Logout

## 🚀 Configuración Inicial

### Prerrequisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Navegador Chrome, Firefox o Edge instalado

### Instalación

1. **Navegar a la carpeta de pruebas:**
   ```bash
   cd e2e-tests
   ```

2. **Crear un entorno virtual (recomendado):**
   ```bash
   python -m venv venv
   ```

3. **Activar el entorno virtual:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

## ⚙️ Configuración

### Variables de Entorno (Opcional)

Puedes crear un archivo `.env` en la raíz del proyecto para configurar:

```env
BROWSER=chrome          # chrome, firefox, edge
HEADLESS=false         # true para ejecutar sin interfaz gráfica
```

### Configuración de Usuario de Prueba

Antes de ejecutar las pruebas, asegúrate de que exista un usuario de prueba en el sistema con las siguientes credenciales (definidas en `config/config.py`):

- Email: `test_user_selenium@example.com`
- Password: `TestPassword123`

**Nota**: Puedes registrar este usuario manualmente en https://testing-uade-frontend.vercel.app/register antes de ejecutar las pruebas.

## 🧪 Ejecución de Pruebas

### Ejecutar todas las pruebas

```bash
pytest tests/
```

### Ejecutar una suite específica

```bash
pytest tests/test_01_registro_usuario.py
pytest tests/test_02_login.py
pytest tests/test_03_crear_evento.py
# ... etc
```

### Ejecutar con marcadores

```bash
# Solo pruebas críticas
pytest -m critical

# Solo pruebas de smoke
pytest -m smoke

# Pruebas de regresión
pytest -m regression
```

### Ejecutar con salida detallada

```bash
pytest -v tests/
```

### Ejecutar en modo headless (sin interfaz gráfica)

```bash
HEADLESS=true pytest tests/
```

## 📊 Reportes

### Reporte Excel

Después de ejecutar las pruebas, se generará automáticamente un reporte Excel en la carpeta `reports/`:

```
reports/reporte_pruebas_YYYYMMDD_HHMMSS.xlsx
```

El reporte incluye:
- ID del caso de prueba
- Historia de usuario asociada
- Nombre del test
- Descripción
- Estado (PASSED/FAILED/SKIPPED/ERROR)
- Fecha de ejecución
- Duración
- Errores u observaciones
- Resumen estadístico con porcentaje de éxito

### Reporte HTML (pytest-html)

También puedes generar un reporte HTML:

```bash
pytest tests/ --html=reports/report.html --self-contained-html
```

### Screenshots

Las capturas de pantalla de los tests fallidos se guardan automáticamente en la carpeta `screenshots/`.

## 📁 Estructura del Proyecto

```
e2e-tests/
├── config/
│   └── config.py              # Configuración general (URL, timeouts, etc.)
├── tests/
│   ├── test_01_registro_usuario.py
│   ├── test_02_login.py
│   ├── test_03_crear_evento.py
│   ├── test_04_visualizar_calendario.py
│   ├── test_05_eliminar_evento.py
│   ├── test_06_navegacion.py
│   └── test_07_logout.py
├── utils/
│   ├── browser_manager.py     # Gestión de navegadores
│   ├── helpers.py              # Funciones auxiliares
│   └── excel_reporter.py       # Generador de reportes Excel
├── reports/                    # Reportes generados
├── screenshots/                # Screenshots de errores
├── conftest.py                 # Configuración de pytest y fixtures
├── requirements.txt            # Dependencias Python
└── README.md                   # Este archivo
```

## 🧩 Casos de Prueba Implementados

### Historia 01 - Registro de Usuario (5 casos)
- CP-01: Registro exitoso con datos válidos
- CP-02: Validación de email duplicado
- CP-03: Validación de contraseña corta
- CP-04: Validación de formato de email inválido
- CP-05: Validación de campos vacíos

### Historia 02 - Inicio de Sesión (6 casos)
- CP-06: Login exitoso con credenciales válidas
- CP-07: Login con email incorrecto
- CP-08: Login con contraseña incorrecta
- CP-09: Login con campos vacíos
- CP-10: Acceso a ruta protegida sin autenticación
- CP-11: Persistencia de sesión JWT

### Historia 03 - Crear Evento Académico (7 casos)
- CP-12: Crear evento tipo Examen completo
- CP-13: Crear evento tipo Entrega sin hora
- CP-14: Crear evento tipo Recordatorio
- CP-15: Validación de título obligatorio
- CP-16: Validación de descripción obligatoria
- CP-17: Validación de fecha obligatoria
- CP-18: Validación de tipos de evento permitidos

### Historia 04 - Visualización de Calendario (9 casos)
- CP-19: Visualizar calendario del mes actual
- CP-20: Verificar que muestra mes y año
- CP-21: Navegar al mes siguiente
- CP-22: Navegar al mes anterior
- CP-23: Verificar días con eventos marcados
- CP-24: Click en día muestra eventos
- CP-25: Diferenciación visual por tipo de evento
- CP-26: Calendario sin eventos
- CP-27: Eventos solo del usuario actual

### Historia 05 - Eliminar Evento (5 casos)
- CP-28: Eliminar evento con confirmación
- CP-29: Cancelar eliminación de evento
- CP-30: Modal de confirmación aparece
- CP-31: Evento eliminado desaparece del calendario
- CP-32: Solo eliminar eventos propios

### Historia 06 - Navegación (4 casos)
- CP-33: Navbar visible en todas las páginas
- CP-34: Navegar a la página de calendario
- CP-35: Navegar a la página de nuevo evento
- CP-36: Volver al calendario desde nuevo evento

### Historia 07 - Logout (3 casos)
- CP-37: Cerrar sesión exitosamente
- CP-38: Sesión eliminada después del logout
- CP-39: Cookies eliminadas después del logout

**Total: 39 casos de prueba**

## 🔧 Solución de Problemas

### Error: "WebDriver not found"
El webdriver-manager debería descargarlo automáticamente. Si hay problemas:
```bash
pip install --upgrade webdriver-manager
```

### Error: "Element not found"
- Verifica que la URL del frontend esté correcta en `config/config.py`
- Aumenta los timeouts en `config/config.py` si la aplicación es lenta
- Verifica que el frontend esté disponible en https://testing-uade-frontend.vercel.app/

### Error: "Authentication failed"
- Asegúrate de que el usuario de prueba esté registrado en el sistema
- Verifica las credenciales en `config/config.py`

## 📝 Notas Importantes

1. **Usuario de Prueba**: Antes de ejecutar las pruebas, registra manualmente el usuario de prueba en la aplicación.

2. **Datos de Prueba**: Las pruebas crean datos (eventos) que pueden acumularse. Puedes limpiar manualmente o implementar un script de limpieza.

3. **Selectores CSS**: Los tests usan selectores CSS genéricos. Si la estructura HTML cambia significativamente, puede ser necesario actualizar los selectores.

4. **Ejecución Paralela**: Actualmente las pruebas se ejecutan secuencialmente. Para ejecución paralela, considera usar `pytest-xdist`.

## 🤝 Contribuir

Para agregar nuevos casos de prueba:

1. Crea un nuevo archivo en `tests/` siguiendo la nomenclatura `test_XX_nombre.py`
2. Importa los helpers necesarios de `utils/`
3. Usa los fixtures `driver` o `authenticated_driver` según corresponda
4. Documenta el caso de prueba con docstrings descriptivos
5. Agrega marcadores (`@pytest.mark.smoke`, `@pytest.mark.critical`, etc.)

## 📄 Licencia

Este proyecto es parte del sistema de Testing de Aplicaciones - UADE.
