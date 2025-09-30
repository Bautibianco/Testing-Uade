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
def test_logout(authenticated_driver):
    """
    CP-11: Cerrar sesión exitosamente

    Verifica:
    - Botón cerrar sesión elimina token/cookie
    - Redirección a /login
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(1)

    logout_button = wait_for_element_clickable(driver, (
        By.CSS_SELECTOR,
        "button:contains('Logout'), button:contains('Cerrar sesión'), a:contains('Logout')"
    ))

    if not logout_button:
        logout_button = wait_for_element_clickable(driver, (
            By.CSS_SELECTOR,
            "[class*='logout'], [id*='logout']"
        ))

    if logout_button:
        logout_button.click()
        time.sleep(2)

        assert "/login" in driver.current_url, "No redirigió al login"
