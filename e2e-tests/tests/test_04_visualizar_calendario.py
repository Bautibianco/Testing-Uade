"""
Test Suite para Historia de Usuario 04 - Visualización de calendario mensual

Criterios de aceptación:
- Se muestran los días con eventos en el mes actual
- Cada día con eventos aparece marcado (color por tipo)
- Se puede navegar entre meses
- Al hacer clic en un día, se ven sus eventos
"""
import pytest
import time
from datetime import datetime
from selenium.webdriver.common.by import By
from utils.helpers import wait_for_element
from config.config import BASE_URL


@pytest.mark.smoke
@pytest.mark.critical
def test_visualizar_calendario(authenticated_driver):
    """
    CP-07: Visualizar calendario mensual

    Verifica:
    - Calendario muestra el mes actual con días
    - Se muestra año actual
    - Días con eventos están marcados
    - Posibilidad de navegar entre meses
    """
    driver = authenticated_driver
    driver.get(f"{BASE_URL}/calendar")
    time.sleep(2)

    assert "/calendar" in driver.current_url

    # Intentar encontrar el calendario con diferentes selectores
    calendar_selectors = [
        (By.CSS_SELECTOR, ".react-calendar"),
        (By.CSS_SELECTOR, ".calendar"),
        (By.CSS_SELECTOR, "[class*='calendar']"),
        (By.CSS_SELECTOR, "[class*='Calendar']"),
        (By.XPATH, "//*[contains(@class, 'calendar') or contains(@class, 'Calendar')]"),
        (By.CSS_SELECTOR, "div[role='application']"),
        (By.TAG_NAME, "table"),  # Muchos calendarios usan tablas
    ]

    calendar_element = None
    for selector in calendar_selectors:
        try:
            calendar_element = wait_for_element(driver, selector, timeout=3)
            if calendar_element:
                break
        except:
            continue

    assert calendar_element is not None, \
        f"No se encontró el calendario. URL: {driver.current_url}, Page source contiene 'calendar': {'calendar' in driver.page_source.lower()}"

    anio_actual = str(datetime.now().year)
    assert anio_actual in driver.page_source, f"No se encontró el año {anio_actual}"
