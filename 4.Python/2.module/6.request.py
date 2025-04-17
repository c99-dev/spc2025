import requests

response = requests.get("https://github.com/c99-dev")
print(response.headers)
