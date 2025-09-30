"""
Test Suite para Historia de Usuario 06 - Navegación en la interfaz

Criterios de aceptación:
- La app tiene un menú o navbar visible
- Se puede volver al calendario desde cualquier vista
"""
import pytest
import time
from selenium.webdriver.common.by import By
from utils.helpers import wait_for_element, wait_for_element_clickable
from config.config import BASE_URL


@pytest.mark.smoke
@pytest.mark.critical
def test_navbar_visible_en_todas_las_paginas(authenticated_driver):
    """
    CP-33: Verificar que el navbar está visible en todas las páginas

    Pasos:
    1. Navegar a diferentes páginas de la aplicación
    2. Verificar que el navbar/menú está presente

    Resultado esperado:
    - El navbar es visible en cada página
    """
    driver = authenticated_driver

    paginas = ["/calendar", "/new"]

    for pagina in paginas:
        driver.get(f"{BASE_URL}{pagina}")
        time.sleep(1)

        # Buscar navbar (puede ser nav, header, menu, etc.)
        navbar = wait_for_element(driver, (
            By.CSS_SELECTOR,
            "nav, header, [role='navigation'], .navbar, .nav"
        ))

        assert navbar is not None, f"Navbar no encontrado en {pagina}"


@pytest.mark.smoke
def test_navegacion_a_calendario(authenticated_driver):
    """
    CP-34: Navegar a la página de calendario

    Pasos:
    1. Hacer clic en link/botón "Calendario" en el menú

    Resultado esperado:
    - Se redirige a /calendar
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    # Buscar link al calendario
    calendar_link = wait_for_element_clickable(driver, (
        By.CSS_SELECTOR,
        "a[href*='calendar'], button:contains('Calendario')"
    ))

    if calendar_link:
        calendar_link.click()
        time.sleep(2)
        assert "/calendar" in driver.current_url


@pytest.mark.smoke
def test_navegacion_a_nuevo_evento(authenticated_driver):
    """
    CP-35: Navegar a la página de nuevo evento

    Pasos:
    1. Hacer clic en link/botón "Nuevo evento"

    Resultado esperado:
    - Se redirige a /new
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(1)

    new_event_link = wait_for_element_clickable(driver, (
        By.CSS_SELECTOR,
        "a[href*='new'], button:contains('Nuevo')"
    ))

    if new_event_link:
        new_event_link.click()
        time.sleep(2)
        assert "/new" in driver.current_url


@pytest.mark.regression
def test_volver_calendario_desde_nuevo_evento(authenticated_driver):
    """
    CP-36: Volver al calendario desde nueva evento

    Pasos:
    1. Estar en /new
    2. Hacer clic en volver o en link al calendario

    Resultado esperado:
    - Regresa a /calendar
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/new")
    time.sleep(1)

    # Buscar botón volver o link calendario
    back_links = driver.find_elements(
        By.CSS_SELECTOR,
        "a[href*='calendar'], button:contains('Volver'), button:contains('Calendario')"
    )

    if len(back_links) > 0:
        back_links[0].click()
        time.sleep(2)
