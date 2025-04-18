# 네이버 검색 API 예제 - 블로그 검색
import json
from dotenv import load_dotenv
import os
import urllib.request

load_dotenv()

client_id = os.environ.get("NAVER_SEARCH_CLIENT_ID")
client_secret = os.environ.get("NAVER_SEARCH_CLIENT_SECRET")
encText = urllib.parse.quote("홍대 눈썹문신")
start = 1
display = 5
url = f"https://openapi.naver.com/v1/search/blog?query={encText}&start={start}&display={display}"
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id", client_id)
request.add_header("X-Naver-Client-Secret", client_secret)
response = urllib.request.urlopen(request)
rescode = response.getcode()
if rescode == 200:
    response_body = response.read()
    # print(response_body.decode("utf-8"))
else:
    print("Error Code:" + rescode)


items = response_body.decode("utf-8")
item_json = json.loads(items)

for item in item_json["items"]:
    print(item["title"])
    print(item["link"])
