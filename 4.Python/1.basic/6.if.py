score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("D")

# password = input("Enter password: ")
# if len(password) >= 8:
#     print("정상")
# else:
#     print("짧음")

filename = "example.txt"
if filename.endswith(".txt"):
    print("This is a text file.")
elif filename.endswith(".jpg"):
    print("This is an image file.")
elif filename.endswith(".png"):
    print("This is a PNG image file.")
else:
    print("Unknown file type.")
