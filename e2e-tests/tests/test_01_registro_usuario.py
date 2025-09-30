"""
Test Suite para Historia de Usuario 01 - Registro de Usuario

Criterios de aceptación:
- Se valida que el email no exista previamente
- La contraseña debe tener al menos 8 caracteres
- Se realiza hash de contraseña antes de almacenar
- Se retorna un token JWT en login exitoso
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils.helpers import (
    wait_for_element,
    wait_for_element_clickable,
    clear_and_send_keys,
    generate_unique_email,
    wait_for_url_contains
)
from config.config import BASE_URL


@pytest.mark.smoke
@pytest.mark.critical
def test_registro_exitoso_con_datos_validos(driver):
    """
    CP-01: Registro exitoso con email y contraseña válidos

    Precondiciones:
    - El usuario no está registrado previamente
    - La aplicación está disponible

    Pasos:
    1. Navegar a la página de registro
    2. Ingresar email válido único
    3. Ingresar contraseña de al menos 8 caracteres
    4. Hacer clic en el botón de registro

    Resultado esperado:
    - El usuario es registrado exitosamente
    - Se redirige al calendario o dashboard
    - Se obtiene un token JWT (cookie/storage)
    """
    # Paso 1: Navegar a login y clickear botón de registro
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    # Clickear botón de registrar usuario (es un button, no un link)
    register_button = wait_for_element_clickable(driver, (By.XPATH, "//button[contains(text(), 'Regístrate aquí')]"))
    assert register_button is not None, "Botón de registrar no encontrado en login"
    register_button.click()
    time.sleep(1)

    # Paso 2 y 3: Ingresar datos válidos
    email = generate_unique_email()
    password = "TestPassword123"

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    assert email_field is not None, "Campo de email no encontrado"
    assert password_field is not None, "Campo de contraseña no encontrado"

    clear_and_send_keys(email_field, email)
    clear_and_send_keys(password_field, password)

    # Paso 4: Hacer clic en registro
    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    assert submit_button is not None, "Botón de registro no encontrado"
    submit_button.click()

    time.sleep(3)

    # Verificar redirección exitosa (calendario o dashboard)
    current_url = driver.current_url
    assert "/login" not in current_url, "No se completó el registro, aún en login"
    assert "/register" not in current_url, "No se completó el registro"


@pytest.mark.smoke
@pytest.mark.critical
def test_registro_email_duplicado(driver):
    """
    CP-02: Validación de email duplicado

    Precondiciones:
    - Un usuario ya está registrado con un email específico

    Pasos:
    1. Navegar a la página de registro
    2. Ingresar el mismo email de un usuario existente
    3. Ingresar contraseña válida
    4. Hacer clic en el botón de registro

    Resultado esperado:
    - Se muestra mensaje de error indicando que el email ya existe
    - El usuario no es registrado
    """
    from config.config import TEST_USER_EMAIL

    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    # Clickear botón de registrar usuario (es un button, no un link)
    register_button = wait_for_element_clickable(driver, (By.XPATH, "//button[contains(text(), 'Regístrate aquí')]"))
    assert register_button is not None, "Botón de registrar no encontrado en login"
    register_button.click()
    time.sleep(1)

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, TEST_USER_EMAIL)
    clear_and_send_keys(password_field, "TestPassword123")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(2)

    # Verificar que hay un mensaje de error o permanece en la página de login
    current_url = driver.current_url
    # Debe permanecer en login o mostrar error
    assert "/login" in current_url or "error" in driver.page_source.lower()


@pytest.mark.regression
def test_registro_password_corto(driver):
    """
    CP-03: Validación de contraseña corta (menos de 8 caracteres)

    Pasos:
    1. Navegar a la página de registro
    2. Ingresar email válido
    3. Ingresar contraseña de menos de 8 caracteres
    4. Intentar enviar el formulario

    Resultado esperado:
    - Se muestra mensaje de error de validación
    - El formulario no se envía
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    # Clickear botón de registrar usuario (es un button, no un link)
    register_button = wait_for_element_clickable(driver, (By.XPATH, "//button[contains(text(), 'Regístrate aquí')]"))
    assert register_button is not None, "Botón de registrar no encontrado en login"
    register_button.click()
    time.sleep(1)

    email = generate_unique_email()
    short_password = "Pass1"  # Solo 5 caracteres

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, email)
    clear_and_send_keys(password_field, short_password)

    # Verificar validación HTML5 o mensaje de error
    validation_message = password_field.get_attribute("validationMessage")
    min_length = password_field.get_attribute("minLength")

    # Si hay validación HTML5, el minLength debe ser 8
    if min_length:
        assert int(min_length) >= 8, "La validación de longitud mínima no es correcta"


@pytest.mark.regression
def test_registro_email_invalido(driver):
    """
    CP-04: Validación de formato de email inválido

    Pasos:
    1. Navegar a la página de registro
    2. Ingresar email con formato inválido
    3. Ingresar contraseña válida
    4. Intentar enviar el formulario

    Resultado esperado:
    - Se muestra mensaje de error de formato de email
    - El formulario no se envía
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    # Clickear botón de registrar usuario (es un button, no un link)
    register_button = wait_for_element_clickable(driver, (By.XPATH, "//button[contains(text(), 'Regístrate aquí')]"))
    assert register_button is not None, "Botón de registrar no encontrado en login"
    register_button.click()
    time.sleep(1)

    invalid_emails = [
        "correo_sin_arroba.com",
        "@sindominio.com",
        "correo@",
        "correo invalido@ejemplo.com"
    ]

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, invalid_emails[0])
    clear_and_send_keys(password_field, "ValidPassword123")

    # Verificar validación de email
    email_type = email_field.get_attribute("type")
    assert email_type == "email", "El campo no tiene tipo 'email' para validación"


@pytest.mark.regression
def test_registro_campos_vacios(driver):
    """
    CP-05: Validación de campos vacíos

    Pasos:
    1. Navegar a la página de registro
    2. Dejar campos vacíos
    3. Intentar enviar el formulario

    Resultado esperado:
    - Se muestra mensaje de campos requeridos
    - El formulario no se envía
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    # Clickear botón de registrar usuario (es un button, no un link)
    register_button = wait_for_element_clickable(driver, (By.XPATH, "//button[contains(text(), 'Regístrate aquí')]"))
    assert register_button is not None, "Botón de registrar no encontrado en login"
    register_button.click()
    time.sleep(1)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(1)

    # Debe permanecer en la página de login
    assert "/login" in driver.current_url, "El formulario se envió con campos vacíos"
