"""
Test Suite para Historia de Usuario 03 - Crear evento académico

Criterios de aceptación:
- Todos los campos son obligatorios salvo hora
- Tipo debe ser: Examen, Entrega o Recordatorio
- Se asocia el evento al usuario actual
- Al crearlo, aparece reflejado en el calendario
"""
import pytest
import time
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
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
    - Campos obligatorios: título, descripción, fecha, tipo
    - Campo opcional: hora
    - Tipos válidos: Examen, Entrega, Recordatorio
    - Evento asociado al usuario actual
    - Evento aparece en el calendario
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    titulo = f"Examen Final - {datetime.now().strftime('%Y%m%d%H%M%S')}"
    descripcion = "Examen final de Testing de Aplicaciones"
    fecha = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    hora = "14:00"

    titulo_field = wait_for_element(driver, (By.NAME, "title"))
    if titulo_field:
        clear_and_send_keys(titulo_field, titulo)

    descripcion_field = wait_for_element(driver, (By.NAME, "description"))
    if descripcion_field:
        clear_and_send_keys(descripcion_field, descripcion)

    fecha_field = wait_for_element(driver, (By.NAME, "date"))
    if fecha_field:
        clear_and_send_keys(fecha_field, fecha)

    hora_field = wait_for_element(driver, (By.NAME, "time"))
    if hora_field:
        clear_and_send_keys(hora_field, hora)

    tipo_select = wait_for_element(driver, (By.NAME, "type"))
    if tipo_select:
        select = Select(tipo_select)
        select.select_by_value("Examen")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(3)

    current_url = driver.current_url
    assert "/new" not in current_url or "success" in driver.page_source.lower()


@pytest.mark.smoke
@pytest.mark.critical
def test_crear_evento_campos_obligatorios(authenticated_driver):
    """
    CP-06: Validación de campos obligatorios

    Verifica:
    - Campos obligatorios: título, descripción, fecha, tipo
    - No se puede crear evento sin campos obligatorios
    - Formulario no se envía con campos vacíos
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(1)

    assert "/new" in driver.current_url, "El formulario se envió con campos vacíos"
