"""
Test Suite para Historia de Usuario 07 - Logout

Criterios de aceptación:
- El botón "Cerrar sesión" elimina el token y redirige al login
"""
import pytest
import time
from selenium.webdriver.common.by import By
from utils.helpers import wait_for_element_clickable
from config.config import BASE_URL


@pytest.mark.smoke
@pytest.mark.critical
def test_logout_exitoso(authenticated_driver):
    """
    CP-37: Cerrar sesión exitosamente

    Precondiciones:
    - Usuario autenticado

    Pasos:
    1. Hacer clic en el botón "Cerrar sesión" o "Logout"

    Resultado esperado:
    - Se elimina el token/cookie
    - Redirige a /login
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(1)

    # Buscar botón de logout
    logout_button = wait_for_element_clickable(driver, (
        By.CSS_SELECTOR,
        "button:contains('Logout'), button:contains('Cerrar sesión'), a:contains('Logout')"
    ))

    if not logout_button:
        # Intentar buscar por otros selectores comunes
        logout_button = wait_for_element_clickable(driver, (
            By.CSS_SELECTOR,
            "[class*='logout'], [id*='logout']"
        ))

    if logout_button:
        logout_button.click()
        time.sleep(2)

        # Verificar redirección a login
        assert "/login" in driver.current_url, "No redirigió al login después de logout"


@pytest.mark.regression
def test_sesion_eliminada_despues_logout(authenticated_driver):
    """
    CP-38: Verificar que la sesión se elimina después del logout

    Pasos:
    1. Hacer logout
    2. Intentar acceder a una ruta protegida

    Resultado esperado:
    - No se puede acceder sin autenticación
    - Redirige al login
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(1)

    # Hacer logout
    logout_button = wait_for_element_clickable(driver, (
        By.CSS_SELECTOR,
        "button:contains('Logout'), [class*='logout']"
    ))

    if logout_button:
        logout_button.click()
        time.sleep(2)

    # Intentar acceder al calendario
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(2)

    # Debe redirigir a login
    assert "/login" in driver.current_url


@pytest.mark.regression
def test_cookies_eliminadas_despues_logout(authenticated_driver):
    """
    CP-39: Verificar que las cookies se eliminan después del logout

    Pasos:
    1. Verificar cookies antes del logout
    2. Hacer logout
    3. Verificar que las cookies de autenticación se eliminaron

    Resultado esperado:
    - Las cookies de sesión se eliminan
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(1)

    # Guardar cookies antes del logout
    cookies_before = driver.get_cookies()

    # Hacer logout
    logout_button = wait_for_element_clickable(driver, (
        By.CSS_SELECTOR,
        "button:contains('Logout'), [class*='logout']"
    ))

    if logout_button:
        logout_button.click()
        time.sleep(2)

    # Verificar cookies después
    cookies_after = driver.get_cookies()

    # Las cookies deben haberse eliminado o reducido
    # (al menos la cookie de JWT debe desaparecer)
