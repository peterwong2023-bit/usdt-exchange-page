import os
import pytest
import datetime
from appium import webdriver
from appium.options.common import AppiumOptions


BROWSERSTACK_USERNAME = os.getenv("BROWSERSTACK_USERNAME", "wongpeter_ymNakb")
BROWSERSTACK_ACCESS_KEY = os.getenv("BROWSERSTACK_ACCESS_KEY", "2mPCHpSbFBd7Krwtusos")

SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)


@pytest.fixture(scope="session")
def driver():
    options = AppiumOptions()
    options.set_capability("platformName", "ios")
    options.set_capability("appium:platformVersion", "17.0")
    options.set_capability("appium:deviceName", "iPhone 15 Pro")
    options.set_capability("appium:app", "bs://11307ce7fa23a419f7db6b9c70dc057f6dc4fab4")
    options.set_capability("appium:automationName", "XCUITest")
    options.set_capability("bstack:options", {
        "userName": BROWSERSTACK_USERNAME,
        "accessKey": BROWSERSTACK_ACCESS_KEY,
        "projectName": "LiveApp-Test",
        "buildName": f"live-test-{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}",
        "sessionName": "直播间列表页测试",
        "debug": True,
        "networkLogs": True,
    })

    remote_url = f"https://hub.browserstack.com/wd/hub"
    appium_driver = webdriver.Remote(remote_url, options=options)
    appium_driver.implicitly_wait(15)

    yield appium_driver

    appium_driver.quit()


def take_screenshot(driver, name):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{name}_{timestamp}.png"
    filepath = os.path.join(SCREENSHOTS_DIR, filename)
    driver.save_screenshot(filepath)
    print(f"[截图] {filepath}")
    return filepath
