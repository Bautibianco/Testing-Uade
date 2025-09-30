"""
Gestión de navegadores para las pruebas E2E
"""
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from config.config import BROWSER, HEADLESS, IMPLICIT_WAIT


class BrowserManager:
    """Clase para gestionar la creación y configuración de navegadores"""

    @staticmethod
    def get_driver():
        """
        Crea y retorna una instancia del navegador configurado
        """
        if BROWSER.lower() == "chrome":
            options = webdriver.ChromeOptions()
            if HEADLESS:
                options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")

            # Usar chromedriver local si existe, sino usar webdriver-manager
            local_chromedriver = os.path.join(os.getcwd(), "chromedriver-win64", "chromedriver-win64", "chromedriver.exe")
            if os.path.exists(local_chromedriver):
                driver_path = local_chromedriver
            else:
                driver_path = ChromeDriverManager().install()

            driver = webdriver.Chrome(
                service=ChromeService(driver_path),
                options=options
            )

        elif BROWSER.lower() == "firefox":
            options = webdriver.FirefoxOptions()
            if HEADLESS:
                options.add_argument("--headless")

            driver = webdriver.Firefox(
                service=FirefoxService(GeckoDriverManager().install()),
                options=options
            )

        elif BROWSER.lower() == "edge":
            options = webdriver.EdgeOptions()
            if HEADLESS:
                options.add_argument("--headless")

            driver = webdriver.Edge(
                service=EdgeService(EdgeChromiumDriverManager().install()),
                options=options
            )
        else:
            raise ValueError(f"Navegador no soportado: {BROWSER}")

        driver.implicitly_wait(IMPLICIT_WAIT)
        driver.maximize_window()

        return driver
