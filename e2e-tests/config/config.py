"""
Configuración base para las pruebas E2E
"""
import os
from dotenv import load_dotenv

load_dotenv()

# URL base de la aplicación
BASE_URL = "https://testing-uade-frontend-git-main-bautibiancos-projects.vercel.app/?_vercel_share=WnqlJSBFtc5PmugJv07UeOHmTd9sCuSs"

# Timeouts
IMPLICIT_WAIT = 10
EXPLICIT_WAIT = 15

# Credenciales de prueba (usuarios de test)
TEST_USER_EMAIL = "test_user_selenium@example.com"
TEST_USER_PASSWORD = "TestPassword123"

# Credenciales de usuario alternativo para pruebas
ALT_USER_EMAIL = "test_alt_user@example.com"
ALT_USER_PASSWORD = "AltPassword123"

# Configuración del navegador
BROWSER = os.getenv("BROWSER", "chrome")  # chrome, firefox, edge
HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"

# Configuración de screenshots
SCREENSHOT_DIR = "screenshots"
SCREENSHOT_ON_FAILURE = True
