import requests
from bs4 import BeautifulSoup

url = "https://pythonscraping.com/pages/page3.html"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

items = soup.select("tr.gift")
for item in items:
    tds = item.find_all("td")
    name = tds[0].get_text().strip()
    price = tds[2].get_text().strip()

    print(f"{name:25}: {price:20}")
