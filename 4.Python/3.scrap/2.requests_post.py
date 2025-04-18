import requests

url = "https://jsonplaceholder.typicode.com/users"

new_post = {"userId": 1, "title": "test", "body": "test"}

response = requests.post(url, json=new_post)
print(response.json())

post_id = 1
updated_post = {"userId": 1, "id": post_id, "title": "test", "body": "test"}
response = requests.put(f"{url}/{post_id}", json=updated_post)
print(response.json())


patch_data = {
    "name": "test",
}
response = requests.patch(f"{url}/{post_id}", json=patch_data)
print(response.json())

response = requests.delete(f"{url}/{post_id}")
print(response.status_code)
