import asyncio
from playwright.async_api import async_playwright


async def fetch_article_content(page, link):
    await page.goto(link)
    content_locator = page.locator("div._article_content")
    if await content_locator.count() > 0:
        content = await content_locator.first.inner_text()
        return content.strip()
    return "본문을 찾을 수 없습니다."


async def main():
    url = "https://sports.news.naver.com/index.nhn"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url)
        lis_locator = page.locator("div#content ul.today_list li")
        tasks = []
        titles = []
        for li in await lis_locator.all():
            a_locator = li.locator("a")
            link = await a_locator.get_attribute("href")
            strong_locator = a_locator.locator("strong")
            title = await strong_locator.inner_text()
            titles.append((title, link))
            tasks.append(fetch_article_content(await browser.new_page(), link))
        contents = await asyncio.gather(*tasks)
        for (title, link), content in zip(titles, contents):
            print(f"타이틀: {title}\n링크: {link}\n본문: {content[:50]}\n{'=' * 40}")
        await browser.close()


asyncio.run(main())
