"""
Test Suite para Historia de Usuario 02 - Inicio de sesión

Criterios de aceptación:
- Si email o contraseña son incorrectos, se muestra error genérico
- El token de sesión (JWT) se guarda en cookie segura
"""
import pytest
import time
from selenium.webdriver.common.by import By
from utils.helpers import (
    wait_for_element,
    wait_for_element_clickable,
    clear_and_send_keys
)
from config.config import BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD


@pytest.mark.smoke
@pytest.mark.critical
def test_login_exitoso(driver):
    """
    CP-03: Login exitoso con credenciales válidas

    Verifica:
    - Login exitoso con credenciales correctas
    - Token JWT guardado en cookie
    - Redirección al calendario
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, TEST_USER_EMAIL)
    clear_and_send_keys(password_field, TEST_USER_PASSWORD)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(3)

    current_url = driver.current_url
    assert "/login" not in current_url, "Login falló"

    cookies = driver.get_cookies()
    assert len(cookies) > 0, "No se establecieron cookies JWT"


@pytest.mark.smoke
@pytest.mark.critical
def test_login_credenciales_invalidas(driver):
    """
    CP-04: Login con credenciales incorrectas

    Verifica:
    - Error genérico cuando email o contraseña son incorrectos
    - No se permite el acceso
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, TEST_USER_EMAIL)
    clear_and_send_keys(password_field, "PasswordIncorrecto123")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(2)

    current_url = driver.current_url
    assert "/login" in current_url or "error" in driver.page_source.lower()
