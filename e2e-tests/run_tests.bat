@echo off
REM Script para ejecutar las pruebas E2E en Windows

echo ========================================
echo   Pruebas E2E - Sistema de Calendario
echo ========================================
echo.

REM Verificar si el entorno virtual existe
if not exist "venv\" (
    echo [ERROR] No se encontro el entorno virtual.
    echo Por favor ejecuta: python -m venv venv
    echo.
    pause
    exit /b 1
)

REM Activar entorno virtual
echo [INFO] Activando entorno virtual...
call venv\Scripts\activate.bat

REM Instalar/actualizar dependencias
echo [INFO] Instalando dependencias...
pip install -r requirements.txt --quiet

echo.
echo [INFO] Iniciando ejecucion de pruebas...
echo.

REM Ejecutar pruebas
pytest tests/ -v

echo.
echo ========================================
echo   Ejecucion completada
echo ========================================
echo.
echo Revisa el reporte Excel en: reports\
echo.

pause
