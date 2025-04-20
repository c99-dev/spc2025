import asyncio
from playwright.async_api import async_playwright


async def get_browser(playwright, headless=True):
    return await playwright.chromium.launch(headless=headless)


async def scrape_news_links(page, url):
    await page.goto(url)
    news_items = []
    list_item_selector = "div.home_news ul.news_list li, div#content ul.today_list li"
    news_item_locators = page.locator(list_item_selector)

    for item_locator in await news_item_locators.all():
        link_locator = item_locator.locator("a")
        title_locator = link_locator.locator("strong, span.title")

        link = await link_locator.get_attribute("href")
        title = await title_locator.first.inner_text()

        news_items.append({"title": title.strip(), "link": link})

    return news_items


async def fetch_article_content(browser, link):
    page = await browser.new_page()
    await page.goto(link, timeout=30000)
    content_locator = page.locator(
        "div#newsEndContents, div#dic_area, div._article_content, em#article_p"
    )
    contents = await content_locator.all()
    contents_text = "\n".join(
        [(await content.inner_text()).strip() for content in contents]
    )
    await page.close()
    return contents_text


def print_results(results):
    for result in results:
        print(f"타이틀: {result['title']}")
        print(f"링크: {result['link']}")
        content_preview = result.get("content", "N/A")
        if len(content_preview) > 100:
            content_preview = content_preview[:100] + "..."
        print(f"본문 미리보기: {content_preview}")
        print("=" * 50)


async def main():
    news_url = "https://sports.news.naver.com/index"

    async with async_playwright() as playwright:
        browser = await get_browser(playwright, headless=True)
        page = await browser.new_page()

        news_links_data = await scrape_news_links(page, news_url)
        await page.close()

        tasks = [
            fetch_article_content(browser, item["link"]) for item in news_links_data
        ]
        article_contents = await asyncio.gather(*tasks)

        results = []
        for i, item in enumerate(news_links_data):
            results.append(
                {
                    "title": item["title"],
                    "link": item["link"],
                    "content": article_contents[i],
                }
            )

        print_results(results)

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
