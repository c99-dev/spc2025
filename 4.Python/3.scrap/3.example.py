import requests

url = "https://example.com"

response = requests.get(url)
data = response.text

print(data)
