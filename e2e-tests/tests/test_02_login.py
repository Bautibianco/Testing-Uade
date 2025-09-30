"""
Test Suite para Historia de Usuario 02 - Inicio de sesión

Criterios de aceptación:
- Si email o contraseña son incorrectos, se muestra error genérico
- El token de sesión (JWT) se guarda en cookie segura
- Se protege el resto de endpoints para usuarios logueados
"""
import pytest
import time
from selenium.webdriver.common.by import By
from utils.helpers import (
    wait_for_element,
    wait_for_element_clickable,
    clear_and_send_keys,
    wait_for_url_contains
)
from config.config import BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD


@pytest.mark.smoke
@pytest.mark.critical
def test_login_exitoso_con_credenciales_validas(driver):
    """
    CP-06: Login exitoso con credenciales válidas

    Precondiciones:
    - Usuario registrado previamente

    Pasos:
    1. Navegar a la página de login
    2. Ingresar email válido
    3. Ingresar contraseña correcta
    4. Hacer clic en el botón de login

    Resultado esperado:
    - Login exitoso
    - Se guarda token JWT en cookie/storage
    - Redirige al calendario/dashboard
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    assert email_field is not None, "Campo de email no encontrado"
    assert password_field is not None, "Campo de contraseña no encontrado"

    clear_and_send_keys(email_field, TEST_USER_EMAIL)
    clear_and_send_keys(password_field, TEST_USER_PASSWORD)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(3)

    # Verificar redirección exitosa
    current_url = driver.current_url
    assert "/login" not in current_url, "Login falló, aún en página de login"

    # Verificar que hay cookies (JWT)
    cookies = driver.get_cookies()
    assert len(cookies) > 0, "No se establecieron cookies después del login"


@pytest.mark.smoke
@pytest.mark.critical
def test_login_con_email_incorrecto(driver):
    """
    CP-07: Login con email incorrecto

    Pasos:
    1. Navegar a la página de login
    2. Ingresar email que no existe
    3. Ingresar cualquier contraseña
    4. Intentar hacer login

    Resultado esperado:
    - Se muestra mensaje de error genérico
    - No se permite el acceso
    - Permanece en la página de login
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, "usuario_inexistente@example.com")
    clear_and_send_keys(password_field, "Password123")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(2)

    # Debe permanecer en login o mostrar error
    current_url = driver.current_url
    assert "/login" in current_url or "error" in driver.page_source.lower()


@pytest.mark.smoke
@pytest.mark.critical
def test_login_con_password_incorrecto(driver):
    """
    CP-08: Login con contraseña incorrecta

    Pasos:
    1. Navegar a la página de login
    2. Ingresar email válido existente
    3. Ingresar contraseña incorrecta
    4. Intentar hacer login

    Resultado esperado:
    - Se muestra mensaje de error genérico
    - No se permite el acceso
    - Permanece en la página de login
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

    # Debe permanecer en login o mostrar error
    current_url = driver.current_url
    assert "/login" in current_url or "error" in driver.page_source.lower()


@pytest.mark.regression
def test_login_campos_vacios(driver):
    """
    CP-09: Login con campos vacíos

    Pasos:
    1. Navegar a la página de login
    2. Dejar campos vacíos
    3. Intentar hacer login

    Resultado esperado:
    - Se muestran mensajes de campos requeridos
    - No se envía el formulario
    """
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(1)

    # Debe permanecer en login
    assert "/login" in driver.current_url


@pytest.mark.regression
def test_acceso_ruta_protegida_sin_autenticacion(driver):
    """
    CP-10: Intento de acceso a rutas protegidas sin autenticación

    Pasos:
    1. Intentar acceder directamente a una ruta protegida (ej: /calendar)
    2. Sin estar autenticado previamente

    Resultado esperado:
    - Se redirige al login
    - No se permite el acceso a la ruta protegida
    """
    # Limpiar cookies para asegurar que no hay sesión
    driver.delete_all_cookies()

    # Intentar acceder a ruta protegida
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(2)

    # Debe redirigir a login
    current_url = driver.current_url
    assert "/login" in current_url, "La ruta protegida no redirigió al login"


@pytest.mark.regression
def test_persistencia_sesion_jwt(driver):
    """
    CP-11: Verificar persistencia de sesión con JWT

    Pasos:
    1. Hacer login exitoso
    2. Navegar a diferentes páginas
    3. Verificar que la sesión persiste

    Resultado esperado:
    - La sesión se mantiene entre navegaciones
    - El token JWT permanece válido
    """
    # Login
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    email_field = wait_for_element(driver, (By.ID, "email"))
    password_field = wait_for_element(driver, (By.ID, "password"))

    clear_and_send_keys(email_field, TEST_USER_EMAIL)
    clear_and_send_keys(password_field, TEST_USER_PASSWORD)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    submit_button.click()

    time.sleep(3)

    # Guardar cookies actuales
    cookies_after_login = driver.get_cookies()

    # Navegar a otra página
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(2)

    # Verificar que sigue autenticado (no redirige a login)
    current_url = driver.current_url
    assert "/login" not in current_url, "La sesión no persistió"

    # Verificar que las cookies siguen presentes
    cookies_after_navigation = driver.get_cookies()
    assert len(cookies_after_navigation) > 0, "Las cookies de sesión se perdieron"
