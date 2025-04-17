my_tuple = (1, 2, 3, 4, 5)
print(my_tuple)

a, b, c, d, e = my_tuple
print(a, b, c, d, e)


def add(x, y):
    return x + y


print(add(a, b))


def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)


print(get_stats(my_tuple))
