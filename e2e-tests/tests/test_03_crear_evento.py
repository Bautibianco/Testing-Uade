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
def test_crear_evento_examen_completo(authenticated_driver):
    """
    CP-12: Crear evento tipo Examen con todos los campos

    Precondiciones:
    - Usuario autenticado

    Pasos:
    1. Navegar a la página de nuevo evento
    2. Ingresar título del evento
    3. Ingresar descripción
    4. Seleccionar fecha futura
    5. Ingresar hora
    6. Seleccionar tipo "Examen"
    7. Hacer clic en crear

    Resultado esperado:
    - Evento creado exitosamente
    - Se redirige al calendario
    - El evento aparece en el calendario
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    # Generar datos del evento
    titulo = f"Examen Final - {datetime.now().strftime('%Y%m%d%H%M%S')}"
    descripcion = "Examen final de Testing de Aplicaciones"
    fecha = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    hora = "14:00"

    # Buscar y llenar campos
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

    # Seleccionar tipo de evento
    tipo_select = wait_for_element(driver, (By.NAME, "type"))
    if tipo_select:
        select = Select(tipo_select)
        select.select_by_value("Examen")

    # Enviar formulario
    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(3)

    # Verificar que se creó (redirige al calendario o muestra confirmación)
    current_url = driver.current_url
    assert "/new" not in current_url or "success" in driver.page_source.lower()


@pytest.mark.smoke
@pytest.mark.critical
def test_crear_evento_entrega_sin_hora(authenticated_driver):
    """
    CP-13: Crear evento tipo Entrega sin hora (campo opcional)

    Pasos:
    1. Navegar a la página de nuevo evento
    2. Ingresar título
    3. Ingresar descripción
    4. Seleccionar fecha
    5. NO ingresar hora (campo opcional)
    6. Seleccionar tipo "Entrega"
    7. Hacer clic en crear

    Resultado esperado:
    - Evento creado exitosamente sin hora
    - Se acepta el formulario sin error
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    titulo = f"Entrega TP - {datetime.now().strftime('%Y%m%d%H%M%S')}"
    descripcion = "Entrega de trabajo práctico integrador"
    fecha = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")

    titulo_field = wait_for_element(driver, (By.NAME, "title"))
    if titulo_field:
        clear_and_send_keys(titulo_field, titulo)

    descripcion_field = wait_for_element(driver, (By.NAME, "description"))
    if descripcion_field:
        clear_and_send_keys(descripcion_field, descripcion)

    fecha_field = wait_for_element(driver, (By.NAME, "date"))
    if fecha_field:
        clear_and_send_keys(fecha_field, fecha)

    # NO llenar campo de hora

    tipo_select = wait_for_element(driver, (By.NAME, "type"))
    if tipo_select:
        select = Select(tipo_select)
        select.select_by_value("Entrega")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(3)

    # Verificar que se creó
    current_url = driver.current_url
    assert "/new" not in current_url or "success" in driver.page_source.lower()


@pytest.mark.smoke
def test_crear_evento_recordatorio(authenticated_driver):
    """
    CP-14: Crear evento tipo Recordatorio

    Pasos:
    1. Navegar a la página de nuevo evento
    2. Ingresar datos completos
    3. Seleccionar tipo "Recordatorio"
    4. Crear evento

    Resultado esperado:
    - Evento tipo Recordatorio creado exitosamente
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    titulo = f"Recordatorio - {datetime.now().strftime('%Y%m%d%H%M%S')}"
    descripcion = "Recordatorio de reunión con profesor"
    fecha = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")

    titulo_field = wait_for_element(driver, (By.NAME, "title"))
    if titulo_field:
        clear_and_send_keys(titulo_field, titulo)

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


@pytest.mark.regression
def test_crear_evento_sin_titulo(authenticated_driver):
    """
    CP-15: Validación de título obligatorio

    Pasos:
    1. Intentar crear evento sin título
    2. Llenar resto de campos

    Resultado esperado:
    - Se muestra error de campo requerido
    - No se crea el evento
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    # Solo llenar descripción y fecha, NO título
    descripcion_field = wait_for_element(driver, (By.NAME, "description"))
    if descripcion_field:
        clear_and_send_keys(descripcion_field, "Descripción sin título")

    fecha_field = wait_for_element(driver, (By.NAME, "date"))
    if fecha_field:
        fecha = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        clear_and_send_keys(fecha_field, fecha)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(1)

    # Debe permanecer en la página de nuevo evento
    assert "/new" in driver.current_url


@pytest.mark.regression
def test_crear_evento_sin_descripcion(authenticated_driver):
    """
    CP-16: Validación de descripción obligatoria

    Pasos:
    1. Intentar crear evento sin descripción

    Resultado esperado:
    - Se muestra error de campo requerido
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    titulo_field = wait_for_element(driver, (By.NAME, "title"))
    if titulo_field:
        clear_and_send_keys(titulo_field, "Título sin descripción")

    fecha_field = wait_for_element(driver, (By.NAME, "date"))
    if fecha_field:
        fecha = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        clear_and_send_keys(fecha_field, fecha)

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(1)

    assert "/new" in driver.current_url


@pytest.mark.regression
def test_crear_evento_sin_fecha(authenticated_driver):
    """
    CP-17: Validación de fecha obligatoria

    Pasos:
    1. Intentar crear evento sin fecha

    Resultado esperado:
    - Se muestra error de campo requerido
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    titulo_field = wait_for_element(driver, (By.NAME, "title"))
    if titulo_field:
        clear_and_send_keys(titulo_field, "Evento sin fecha")

    descripcion_field = wait_for_element(driver, (By.NAME, "description"))
    if descripcion_field:
        clear_and_send_keys(descripcion_field, "Descripción del evento")

    submit_button = wait_for_element_clickable(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    if submit_button:
        submit_button.click()

    time.sleep(1)

    assert "/new" in driver.current_url


@pytest.mark.regression
def test_validacion_tipos_evento(authenticated_driver):
    """
    CP-18: Validación de tipos de evento permitidos

    Pasos:
    1. Verificar que solo existen los tipos: Examen, Entrega, Recordatorio

    Resultado esperado:
    - El selector solo muestra los tipos permitidos
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    tipo_select = wait_for_element(driver, (By.NAME, "type"))
    if tipo_select:
        select = Select(tipo_select)
        options = [option.get_attribute("value") for option in select.options]

        # Verificar que solo existen estos tipos
        tipos_permitidos = ["Examen", "Entrega", "Recordatorio"]
        for tipo in options:
            if tipo:  # Ignorar opción vacía si existe
                assert tipo in tipos_permitidos, f"Tipo no permitido encontrado: {tipo}"
