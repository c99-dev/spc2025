from playwright.sync_api import sync_playwright
import csv

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("https://www.naver.com")

    search_box = page.locator("input[name='query']")
    search_box.wait_for()
    search_box.fill("python programming")
    search_box.press("Enter")
    book_list = page.locator(".book_list")
    book_list.wait_for(timeout=5000)

    book_items = book_list.locator(".item")
    count = book_items.count()

    book_list = []
    for i in range(count):
        item = book_items.nth(i)
        title_elem = item.locator(".item_title")
        title = title_elem.inner_text()
        link = title_elem.get_attribute("href")
        book_list.append({"title": title, "link": link})

    with open("books.csv", "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["title", "link"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for book in book_list:
            writer.writerow(book)

    browser.close()
