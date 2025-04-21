from playwright.sync_api import sync_playwright
import os
import requests
import json
import re


def run(playwright):
    base_url = "https://www.moviechart.co.kr"
    local_dir = os.path.dirname(os.path.abspath(__file__))

    browser = playwright.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto(base_url + "/rank/realtime/index/image")
    movies_list = page.locator("ul.movieBox-list > li").all()

    movies_dict = {}
    for movie in movies_list:
        # 3-1. 제목, 이미지경로, 상세 페이지 링크, 랭크
        info = movie.locator("div.movie-info")
        movie_a = movie.locator("a").first
        image_link = base_url + movie_a.locator("img").get_attribute("src")
        rank = movie_a.locator("p.rank").inner_text()
        title_text = info.locator("div.movie-title").inner_text()
        link = base_url + movie_a.get_attribute("href")

        # 3-2. 로컬 PC에 이미지 저장
        if not os.path.exists(os.path.join(local_dir, "images")):
            os.makedirs(os.path.join(local_dir, "images"))
        file_name = re.sub(r'[\\/*?:"<>|. ]', "_", title_text) + ".jpg"
        file_path = os.path.join(local_dir, "images", file_name)
        response = requests.get(image_link)
        with open(file_path, "wb") as image:
            image.write(response.content)

        # 3-3. 상세 페이지 링크를 타고 들어가서 시놉시스(줄거리) 가져오기
        page.goto(link)
        synopsis = page.locator("div.text").inner_text()
        page.goto(base_url + "/rank/realtime/index/image")

        movies_dict[rank] = {"title": title_text, "link": link, "synopsis": synopsis}

    browser.close()

    csv_file_path = os.path.join(local_dir, "movies.csv")
    json_file_path = os.path.join(local_dir, "movies.json")
    # 3-4. csv에 저장하기 및 json 으로도 저장해보기
    with open(csv_file_path, "w", encoding="utf-8") as csv_file:
        csv_file.write("Rank,Title,Link,Synopsis\n")

    for rank, movie in movies_dict.items():
        with open(csv_file_path, "a", encoding="utf-8") as csv_file:
            csv_file.write(
                f'"{rank}","{movie["title"]}","{movie["link"]}","{movie["synopsis"].replace('"', '""')}"\n'
            )

    with open(json_file_path, "w", encoding="utf-8") as json_file:
        json.dump(movies_dict, json_file, ensure_ascii=False, indent=4)


def main():
    with sync_playwright() as playwright:
        run(playwright)


if __name__ == "__main__":
    main()
