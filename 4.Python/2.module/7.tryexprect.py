try:
    result = 10 / 0
except ZeroDivisionError as e:
    print("에러 발생:", e)
else:
    print("알 수 없는 에러 발생")


def convert_str_to_int(s):
    try:
        return int(s)
    except ValueError as e:
        print("문자열을 정수로 변환할 수 없습니다:", e)
        return None


convert_str_to_int("123")
convert_str_to_int("abc")
