my_list = [1, 2, 3, 4, 5]

print(my_list)
print(len(my_list))

print(my_list[0])
print(my_list[1])
print(my_list[2])
print(my_list[-3])
print(my_list[-4])
print(my_list[-5])

print(my_list[1:3])
print(my_list[1:3][::-1])

my_list.append(6)
print(my_list)

my_list.insert(2, 0)
print(my_list)

my_list.remove(0)
print(my_list)

print(my_list.pop(3))
print(my_list)

numbers = [x for x in range(1, 11)]
print(numbers)

numbers = [x**2 for x in range(1, 11)]
print(numbers)

numbers = [x for x in range(1, 11) if x % 2 == 0]
print(numbers)

numbers = [x for x in range(1, 11) if x % 2 == 1]
print(numbers)
