"""
Funciones auxiliares para las pruebas E2E
"""
import os
from datetime import datetime
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from config.config import EXPLICIT_WAIT, SCREENSHOT_DIR


def wait_for_element(driver, locator, timeout=EXPLICIT_WAIT):
    """
    Espera hasta que un elemento esté presente en el DOM
    """
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
        return element
    except TimeoutException:
        return None


def wait_for_element_clickable(driver, locator, timeout=EXPLICIT_WAIT):
    """
    Espera hasta que un elemento sea clickeable
    """
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable(locator)
        )
        return element
    except TimeoutException:
        return None


def wait_for_url_contains(driver, text, timeout=EXPLICIT_WAIT):
    """
    Espera hasta que la URL contenga un texto específico
    """
    try:
        WebDriverWait(driver, timeout).until(
            EC.url_contains(text)
        )
        return True
    except TimeoutException:
        return False


def take_screenshot(driver, test_name):
    """
    Toma una captura de pantalla y la guarda con timestamp
    """
    if not os.path.exists(SCREENSHOT_DIR):
        os.makedirs(SCREENSHOT_DIR)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{SCREENSHOT_DIR}/{test_name}_{timestamp}.png"
    driver.save_screenshot(filename)
    return filename


def clear_and_send_keys(element, text):
    """
    Limpia un campo de entrada y escribe texto
    """
    element.clear()
    element.send_keys(text)


def generate_unique_email():
    """
    Genera un email único para pruebas
    """
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"test_user_{timestamp}@example.com"
