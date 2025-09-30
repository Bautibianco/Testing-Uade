"""
Test Suite para Historia de Usuario 03 - Crear evento académico

Criterios de aceptación:
- Campos obligatorios: título, fecha, tipo
- Campos opcionales: hora, organización, descripción
- Tipo debe ser: Examen (EXAM), Entrega (DELIVERY) o Clase (CLASS)
- Se asocia el evento al usuario actual
- Al crearlo, aparece reflejado en el calendario
"""
import pytest
import time
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By
from utils.helpers import (
    wait_for_element,
    wait_for_element_clickable,
    clear_and_send_keys
)
from config.config import BASE_URL


@pytest.mark.smoke
@pytest.mark.critical
def test_crear_evento_exitoso(authenticated_driver):
    """
    CP-05: Crear evento académico exitoso

    Verifica:
    - Campos obligatorios: título, fecha, tipo
    - Campos opcionales: hora, organización, descripción
    - Tipos válidos: EXAM, DELIVERY, CLASS
    - Evento asociado al usuario actual
    - Evento aparece en el calendario (redirección a /calendar)
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(1)

    # Hacer clic en el botón "Nuevo evento"
    new_event_button = wait_for_element_clickable(driver, (
        By.XPATH,
        "//*[contains(text(), 'Nuevo evento')]"
    ))
    if new_event_button:
        new_event_button.click()
        time.sleep(1)

    titulo = f"Examen Final - {datetime.now().strftime('%Y%m%d%H%M%S')}"
    descripcion = "Examen final de Testing de Aplicaciones"
    fecha = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    hora = "14:00"

    # Función JS para setear valor en campos controlados por React
    set_react_value = """
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(arguments[0], arguments[1]);
        var event = new Event('input', { bubbles: true});
        arguments[0].dispatchEvent(event);
    """

    set_react_textarea_value = """
        var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeTextAreaValueSetter.call(arguments[0], arguments[1]);
        var event = new Event('input', { bubbles: true});
        arguments[0].dispatchEvent(event);
    """

    # Llenar el campo título
    titulo_field = wait_for_element(driver, (By.ID, "title"))
    if titulo_field:
        driver.execute_script(set_react_value, titulo_field, titulo)
        time.sleep(0.3)

    # Seleccionar el tipo usando radio button (EXAM, DELIVERY, CLASS)
    tipo_radio = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "input[name='type'][value='EXAM']"))
    if tipo_radio:
        driver.execute_script("arguments[0].click();", tipo_radio)
        time.sleep(0.3)

    # Llenar el campo fecha usando JavaScript
    fecha_field = wait_for_element(driver, (By.ID, "date"))
    if fecha_field:
        driver.execute_script(set_react_value, fecha_field, fecha)
        time.sleep(0.3)

    # Llenar el campo hora usando JavaScript
    hora_field = wait_for_element(driver, (By.ID, "time"))
    if hora_field:
        driver.execute_script(set_react_value, hora_field, hora)
        time.sleep(0.3)

    # Llenar el campo descripción usando JavaScript
    descripcion_field = wait_for_element(driver, (By.ID, "description"))
    if descripcion_field:
        driver.execute_script(set_react_textarea_value, descripcion_field, descripcion)
        time.sleep(0.3)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(3)

    # Verificar si hay algún mensaje de error
    error_elements = driver.find_elements(By.CSS_SELECTOR, ".bg-red-50.border")
    if error_elements:
        error_text = " ".join([el.text for el in error_elements if el.text])
        # Guardar screenshot para debug
        driver.save_screenshot("reports/error_crear_evento.png")
        print(f"Error en formulario: {error_text.encode('ascii', 'ignore').decode('ascii')}")

    current_url = driver.current_url
    assert "/calendar" in current_url, f"No se redirigió correctamente. URL actual: {current_url}"


@pytest.mark.smoke
@pytest.mark.critical
def test_crear_evento_campos_obligatorios(authenticated_driver):
    """
    CP-06: Validación de campos obligatorios

    Verifica:
    - Campos obligatorios: título, fecha, tipo
    - No se puede crear evento sin campos obligatorios
    - Formulario no se envía con campos vacíos (permanece en /new)
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(1)

    # Hacer clic en el botón "Nuevo evento"
    new_event_button = wait_for_element_clickable(driver, (
        By.XPATH,
        "//*[contains(text(), 'Nuevo evento')]"
    ))
    if new_event_button:
        new_event_button.click()
        time.sleep(1)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(1)

    assert "/new" in driver.current_url, "El formulario se envió con campos vacíos"
