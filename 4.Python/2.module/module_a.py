def function_a1():
    print("module_a의 function_a1() 호출")
    function_a2()


def function_a2():
    print("module_a의 function_a2() 호출")
    function_a3()


def function_a3():
    print("module_a의 function_a3() 호출")
    function_hello()


def function_hello():
    print("module_a의 hello() 호출")


def function_goodbye():
    print("module_a의 goodbye() 호출")
    raise RuntimeError("module_a의 function_goodbye()에서 오류 발생")


if __name__ == "__main__":
    print("module_a.py가 직접 실행됨")
