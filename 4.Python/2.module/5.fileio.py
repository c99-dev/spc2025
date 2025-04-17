with open("example.txt", "w") as file:
    file.write("Hello, world!")

print("다 끝남")

with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())
