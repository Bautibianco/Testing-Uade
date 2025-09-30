"""
Test Suite para Historia de Usuario 01 - Registro de Usuario

Criterios de aceptación:
- Se valida que el email no exista previamente
- La contraseña debe tener al menos 8 caracteres
"""
import pytest
import time
from selenium.webdriver.common.by import By
from utils.helpers import (
    wait_for_element,
    wait_for_element_clickable,
    clear_and_send_keys,
    generate_unique_email
)
from config.config import BASE_URL


@pytest.mark.smoke
@pytest.mark.critical
def test_registro_exitoso(driver):
    """
    CP-01: Registro exitoso con email y contraseña válidos

    Verifica:
    - Email no existente previo se registra correctamente
    - Contraseña de al menos 8 caracteres es aceptada
    - Redirección exitosa al calendario
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    register_button = wait_for_element_clickable(driver, (By.XPATH, "//button[contains(text(), 'Regístrate aquí')]"))
    register_button.click()
    time.sleep(1)

    email = generate_unique_email()
    password = "TestPassword123"

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, email)
    clear_and_send_keys(password_field, password)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(3)

    current_url = driver.current_url
    assert "/login" not in current_url, "No se completó el registro"
    assert "/register" not in current_url, "No se completó el registro"


@pytest.mark.smoke
@pytest.mark.critical
def test_registro_email_duplicado(driver):
    """
    CP-02: Validación de email duplicado

    Verifica:
    - No se permite registrar un email que ya existe
    - Se muestra error o permanece en la página
    """
    from config.config import TEST_USER_EMAIL

    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    register_button = wait_for_element_clickable(driver, (By.XPATH, "//button[contains(text(), 'Regístrate aquí')]"))
    register_button.click()
    time.sleep(1)

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, TEST_USER_EMAIL)
    clear_and_send_keys(password_field, "TestPassword123")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(2)

    current_url = driver.current_url
    assert "/login" in current_url or "error" in driver.page_source.lower()
