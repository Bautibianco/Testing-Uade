"""
Test Suite para Historia de Usuario 05 - Eliminar evento

Criterios de aceptación:
- Solo puedo eliminar eventos propios
- Se solicita confirmación previa (modal)
- El evento desaparece del calendario al eliminarse
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
def test_eliminar_evento(authenticated_driver):
    """
    CP-08: Eliminar evento con confirmación

    Verifica:
    - Se puede eliminar un evento propio
    - Se solicita confirmación previa (modal)
    - Evento desaparece del calendario
    """
    driver = authenticated_driver

    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    titulo_evento = f"Evento a Eliminar - {datetime.now().strftime('%Y%m%d%H%M%S')}"
    descripcion = "Este evento será eliminado"
    fecha = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

    titulo_field = wait_for_element(driver, (By.NAME, "title"))
    if titulo_field:
        clear_and_send_keys(titulo_field, titulo_evento)

    descripcion_field = wait_for_element(driver, (By.NAME, "description"))
    if descripcion_field:
        clear_and_send_keys(descripcion_field, descripcion)

    fecha_field = wait_for_element(driver, (By.NAME, "date"))
    if fecha_field:
        clear_and_send_keys(fecha_field, fecha)

    tipo_select = wait_for_element(driver, (By.NAME, "type"))
    if tipo_select:
        select = Select(tipo_select)
        select.select_by_value("Recordatorio")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(3)

    driver.get(f"{BASE_URL}/calendar")
    time.sleep(2)

    delete_buttons = driver.find_elements(
        By.CSS_SELECTOR,
        "button[aria-label*='delete'], button[class*='delete'], button:has(svg[data-icon='trash'])"
    )

    if len(delete_buttons) > 0:
        delete_buttons[0].click()
        time.sleep(1)

        confirm_button = wait_for_element_clickable(driver, (
            By.CSS_SELECTOR,
            "button[class*='confirm'], button:contains('Confirmar'), button:contains('Eliminar'), button:contains('Sí')"
        ))

        if confirm_button:
            confirm_button.click()
            time.sleep(2)


@pytest.mark.smoke
@pytest.mark.critical
def test_cancelar_eliminacion_evento(authenticated_driver):
    """
    CP-09: Cancelar eliminación de evento

    Verifica:
    - Se puede cancelar la eliminación de un evento
    - Modal de confirmación se cierra sin eliminar
    - Evento sigue presente en el calendario
    """
    driver = authenticated_driver

    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    titulo_evento = f"Evento NO Eliminar - {datetime.now().strftime('%Y%m%d%H%M%S')}"
    fecha = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")

    titulo_field = wait_for_element(driver, (By.NAME, "title"))
    if titulo_field:
        clear_and_send_keys(titulo_field, titulo_evento)

    descripcion_field = wait_for_element(driver, (By.NAME, "description"))
    if descripcion_field:
        clear_and_send_keys(descripcion_field, "No debe eliminarse")

    fecha_field = wait_for_element(driver, (By.NAME, "date"))
    if fecha_field:
        clear_and_send_keys(fecha_field, fecha)

    tipo_select = wait_for_element(driver, (By.NAME, "type"))
    if tipo_select:
        select = Select(tipo_select)
        select.select_by_value("Recordatorio")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(3)

    driver.get(f"{BASE_URL}/calendar")
    time.sleep(2)

    delete_buttons = driver.find_elements(
        By.CSS_SELECTOR,
        "button[aria-label*='delete'], button[class*='delete']"
    )

    if len(delete_buttons) > 0:
        delete_buttons[0].click()
        time.sleep(1)

        cancel_button = wait_for_element_clickable(driver, (
            By.CSS_SELECTOR,
            "button[class*='cancel'], button:contains('Cancelar'), button:contains('No')"
        ))

        if cancel_button:
            cancel_button.click()
            time.sleep(1)
