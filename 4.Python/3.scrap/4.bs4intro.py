import requests
from bs4 import BeautifulSoup

url = "https://example.com"
response = requests.get(url)
data = response.text
soup = BeautifulSoup(data, "html.parser")
print(soup.prettify())
print(soup.title.string)
print(soup.find("h1").text)
print(soup.find("p").text)
