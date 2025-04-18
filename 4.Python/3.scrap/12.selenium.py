from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
import time

service = ChromeService(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

driver.get("https://www.naver.com")
time.sleep(1)
search_box = driver.find_element(By.NAME, "query")
search_box.send_keys("python programming")
search_box.submit()

time.sleep(3)

book_list = driver.find_element(By.CLASS_NAME, "book_list")
book_items = book_list.find_elements(By.CLASS_NAME, "item")
for item in book_items:
    title = item.find_element(By.CLASS_NAME, "item_title")
    print(f"타이틀: {title.text}")
    print(f"링크: {title.get_attribute('href')}\n")


driver.quit()
