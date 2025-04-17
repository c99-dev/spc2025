def greet(name):
    print(f"Hello, {name}!")


greet("Alice")


def add(x, y):
    return x + y


print(add(5, 3))


def greet_default(name="World"):
    print(f"Hello, {name}!")


greet_default()
greet_default("Alice")


def example(a, b, c):
    print(a, b, c)


example(1, 2, 3)
example(a=4, c=2, b=3)


def print_gugudan(dan):
    print(f"{dan}단")
    for i in range(1, 10):
        print(f"{dan} * {i} = {dan * i}")


for i in range(2, 10):
    print_gugudan(i)
