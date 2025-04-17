x = 5
y = "Hello"
z = [1, 2, 3]

print(type(x))
print(type(y))
print(type(z))


print(isinstance(x, int))
print(isinstance(x, str))


class A:
    pass


class B(A):
    pass


class C:
    pass


b = B()
print(isinstance(b, A))
print(isinstance(b, B))
print(isinstance(b, C))
