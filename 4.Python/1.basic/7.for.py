numbers = [i for i in range(1, 6)]

for num in numbers:
    print(num)

for num in numbers:
    if num % 2 == 0:
        print(f"{num} is even")
    else:
        print(f"{num} is odd")

even_numbers, odd_numbers = [], []
for num in numbers:
    if num % 2 == 0:
        even_numbers.append(num)
    else:
        odd_numbers.append(num)
print("Even numbers:", even_numbers)
print("Odd numbers:", odd_numbers)

students = {"Jhon": 85, "Mike": 90, "Sara": 78, "Anna": 64}

for student, score in students.items():
    if score >= 80:
        print(f"{student} has passed with a score of {score}")
    else:
        print(f"{student} has failed with a score of {score}")
