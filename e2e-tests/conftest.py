"""
Configuración de fixtures de pytest para las pruebas E2E
"""
import pytest
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.browser_manager import BrowserManager
from utils.helpers import take_screenshot
from utils.excel_reporter import ExcelReporter
from config.config import BASE_URL, SCREENSHOT_ON_FAILURE

# Variable global para el reporte Excel
excel_reporter = None
test_results = []


@pytest.fixture(scope="function")
def driver():
    """
    Fixture que crea y destruye una instancia del navegador para cada test
    """
    driver = BrowserManager.get_driver()
    driver.get(BASE_URL)

    yield driver

    driver.quit()


@pytest.fixture(scope="function")
def authenticated_driver(driver):
    """
    Fixture que proporciona un driver con usuario autenticado
    Útil para tests que requieren login previo
    """
    from config.config import TEST_USER_EMAIL, TEST_USER_PASSWORD
    from selenium.webdriver.common.by import By
    from utils.helpers import wait_for_element, clear_and_send_keys
    import time

    # Ir a la página de login
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    # Intentar hacer login (asume que el usuario ya existe)
    try:
        email_field = wait_for_element(driver, (By.ID, "email"))
        password_field = wait_for_element(driver, (By.ID, "password"))

        if email_field and password_field:
            clear_and_send_keys(email_field, TEST_USER_EMAIL)
            clear_and_send_keys(password_field, TEST_USER_PASSWORD)

            submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()

            time.sleep(2)
    except Exception as e:
        print(f"Warning: Could not authenticate - {str(e)}")

    yield driver


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Hook para capturar screenshots en caso de fallo
    """
    outcome = yield
    rep = outcome.get_result()

    if rep.when == "call" and rep.failed and SCREENSHOT_ON_FAILURE:
        driver = item.funcargs.get("driver") or item.funcargs.get("authenticated_driver")
        if driver:
            take_screenshot(driver, item.name)


def pytest_configure(config):
    """
    Configuración inicial de pytest
    """
    global excel_reporter
    excel_reporter = ExcelReporter()

    config.addinivalue_line(
        "markers", "smoke: marca tests de smoke testing"
    )
    config.addinivalue_line(
        "markers", "regression: marca tests de regresión"
    )
    config.addinivalue_line(
        "markers", "critical: marca tests críticos"
    )


def pytest_runtest_logreport(report):
    """
    Hook que se ejecuta después de cada test para recolectar resultados
    """
    if report.when == "call":
        # Extraer información del test
        test_name = report.nodeid.split("::")[-1]
        test_file = report.nodeid.split("::")[0]

        # Mapear archivos de test a historias de usuario
        historia_map = {
            "test_01_registro_usuario.py": "HU-01: Registro de Usuario",
            "test_02_login.py": "HU-02: Inicio de sesión",
            "test_03_crear_evento.py": "HU-03: Crear evento académico",
            "test_04_visualizar_calendario.py": "HU-04: Visualización de calendario mensual",
            "test_05_eliminar_evento.py": "HU-05: Eliminar evento",
            "test_06_navegacion.py": "HU-06: Navegación en la interfaz",
            "test_07_logout.py": "HU-07: Logout"
        }

        # Obtener historia de usuario
        historia = "Desconocida"
        for file_pattern, hu in historia_map.items():
            if file_pattern in test_file:
                historia = hu
                break

        # Obtener ID del caso de prueba (extrae CP-XX del docstring si existe)
        test_id = "N/A"
        description = test_name.replace("test_", "").replace("_", " ").capitalize()

        if hasattr(report, 'longrepr') and report.longrepr:
            # Extraer del docstring
            pass

        # Estado del test
        if report.passed:
            status = "PASSED"
            error_msg = ""
        elif report.failed:
            status = "FAILED"
            error_msg = str(report.longrepr)[:200] if report.longrepr else "Test failed"
        elif report.skipped:
            status = "SKIPPED"
            error_msg = str(report.longrepr)[:200] if report.longrepr else "Test skipped"
        else:
            status = "ERROR"
            error_msg = "Unknown error"

        duration = report.duration

        # Guardar resultado
        test_results.append({
            'test_id': test_id,
            'historia': historia,
            'test_name': test_name,
            'description': description,
            'status': status,
            'duration': duration,
            'error_msg': error_msg
        })


def pytest_sessionfinish(session, exitstatus):
    """
    Hook que se ejecuta al finalizar toda la sesión de tests
    Genera el reporte Excel
    """
    global excel_reporter, test_results

    if excel_reporter and test_results:
        # Agregar cada resultado al reporte Excel
        for result in test_results:
            excel_reporter.add_test_result(
                test_id=result['test_id'],
                historia=result['historia'],
                test_name=result['test_name'],
                description=result['description'],
                status=result['status'],
                duration=result['duration'],
                error_msg=result['error_msg']
            )

        # Guardar el reporte
        excel_reporter.save()
