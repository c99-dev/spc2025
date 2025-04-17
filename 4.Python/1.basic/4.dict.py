my_dict = {"name": "John", "age": 30, "city": "New York"}
print(my_dict)

print(my_dict["name"])
print(my_dict["age"])
print(my_dict["city"])

my_dict["age"] = 31
print(my_dict["age"])

my_dict["country"] = "USA"
print(my_dict)

del my_dict["city"]
print(my_dict)

print(my_dict.keys())
print(my_dict.values())
print(my_dict.items())
print("name" in my_dict)
print("city" in my_dict)
print("country" in my_dict)
print(my_dict.get("name"))
print(my_dict.get("city", "Not found"))
