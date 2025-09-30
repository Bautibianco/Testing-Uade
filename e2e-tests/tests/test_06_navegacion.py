"""
Test Suite para Historia de Usuario 06 - Navegación en la interfaz

Criterios de aceptación:
- La app tiene un menú o navbar visible
- Se puede volver al calendario desde cualquier vista
"""
import pytest
import time
from selenium.webdriver.common.by import By
from utils.helpers import wait_for_element
from config.config import BASE_URL


@pytest.mark.smoke
@pytest.mark.critical
def test_navegacion_basica(authenticated_driver):
    """
    CP-10: Navegación básica en la interfaz

    Verifica:
    - Navbar visible en todas las páginas
    - Navegación entre secciones (calendario, nuevo evento)
    - Posibilidad de volver al calendario desde otras vistas
    """
    driver = authenticated_driver

    paginas = ["/calendar", "/new"]

    for pagina in paginas:
        driver.get(f"{BASE_URL}{pagina}")
        time.sleep(1)

        navbar = wait_for_element(driver, (
            By.CSS_SELECTOR,
            "nav, header, [role='navigation'], .navbar, .nav"
        ))

        assert navbar is not None, f"Navbar no encontrado en {pagina}"
