ROWS = 5


def left_triangle_asc(rows):
    for i in range(1, rows + 1):
        print("*" * i)


def right_triangle_asc(rows):
    for i in range(1, rows + 1):
        print(" " * (rows - i) + "*" * i)


def equal_triangle(rows):
    for i in range(1, rows + 1):
        print(" " * (rows - i) + "*" * (2 * i - 1))


def diamond(rows):
    for i in range(1, rows + 1):
        print(" " * (rows - i) + "*" * (2 * i - 1))
    for i in range(rows - 1, 0, -1):
        print(" " * (rows - i) + "*" * (2 * i - 1))


print("-1-")
left_triangle_asc(ROWS)
print("-2-")
right_triangle_asc(ROWS)
print("-3-")
equal_triangle(ROWS)
print("-4-")
diamond(ROWS)
