#!/bin/bash

# Script para ejecutar las pruebas E2E en Linux/Mac

echo "========================================"
echo "  Pruebas E2E - Sistema de Calendario"
echo "========================================"
echo ""

# Verificar si el entorno virtual existe
if [ ! -d "venv" ]; then
    echo "[ERROR] No se encontró el entorno virtual."
    echo "Por favor ejecuta: python3 -m venv venv"
    echo ""
    exit 1
fi

# Activar entorno virtual
echo "[INFO] Activando entorno virtual..."
source venv/bin/activate

# Instalar/actualizar dependencias
echo "[INFO] Instalando dependencias..."
pip install -r requirements.txt --quiet

echo ""
echo "[INFO] Iniciando ejecución de pruebas..."
echo ""

# Ejecutar pruebas
pytest tests/ -v

echo ""
echo "========================================"
echo "  Ejecución completada"
echo "========================================"
echo ""
echo "Revisa el reporte Excel en: reports/"
echo ""
