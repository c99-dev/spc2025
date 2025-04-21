# 1
print("Hello World")

# 2
print("Mary's cosmetics")

# 3
print('신씨가 소리질렀다. "도둑이야".')

# 4
print(r"C:\Windows")

# 5
print("안녕하세요.\n만나서\t\t반갑습니다.")

# \n == 개행 \t == 탭

# 6
print("오늘은", "일요일")
# 오늘은 일요일

# 7
print("naver", "kakao", "sk", "samsung", sep=";")

# 8
print("naver", "kakao", "sk", "samsung", sep="/")

# 9
print("first", end="")
print("second")

# 10
print(5 / 3)

# 11
삼성전자 = 50000
보유주식수 = 10
총평가금액 = 삼성전자 * 보유주식수
print(총평가금액)

# 12
삼전투자정보 = {"시가총액": 298000000000000, "현재가": 50000, "PER": 15.79}

print(삼전투자정보)

# 13
s = "hello"
t = "python"

print(s, t, sep="! ")

# 14
# 2 + 2 * 3 = 8

# 15
a = "132"
print(type(a))

# 16
num_str = "720"
print(int(num_str))

# 17
num = 100
print(str(num))

# 18
float_str = "15.79"
print(float(float_str))

# 19
year = "2020"
int_year = int(year)
for i in range(1, 4):
    print(int_year - i)

# 20
month_price = 48584
payment_term = 36
total_payment = month_price * payment_term
print(total_payment)

# 21
letters = "python"
print(letters[0], letters[2])

# 22
license_plate = "24가 2210"
print(license_plate[-4:])

# 23
string = "홀짝홀짝홀짝"
print(string[::2])

# 24
string = "PYTHON"
print(string[::-1])

# 25
phone_number = "010-1111-2222"
print(phone_number.replace("-", " "))

# 26
print(phone_number.replace("-", ""))

# 27
url = "http://sharebook.kr"
print(url.split(".")[-1])

# 28
# 수정 불가능

# 29
string = "abcdfe2a354a32a"
print(string.replace("a", "A"))

# 30
# abcd

# 31
# 34

# 32
# HiHiHi

# 33
print("-" * 80)

# 34
t1 = "python"
t2 = "java"
print((t1 + " " + t2 + " ") * 4)

# 35
name1 = "김민수"
age1 = 10
name2 = "이철희"
age2 = 13
print("이름: %s, 나이: %d" % (name1, age1))
print("이름: %s, 나이: %d" % (name2, age2))

# 36
print("이름: {}, 나이: {}".format(name1, age1))
print("이름: {}, 나이: {}".format(name2, age2))

# 37
print(f"이름: {name1}, 나이: {age1}")
print(f"이름: {name2}, 나이: {age2}")

# 38
상장주식수 = "5,969,782,550"
print(int(상장주식수.replace(",", "")))

# 39
분기 = "2020/03(E) (IFRS연결)"
print(분기[:7])

# 40
data = "   삼성전자    "
print(data.strip())

# 41
ticker = "btc_krw"
print(ticker.upper())

# 42
ticker = "BTC_KRW"
print(ticker.lower())

# 43
a = "hello"
a = a.capitalize()

# 44
file_name = "보고서.xlsx"
print(file_name.endswith("xlsx"))

# 45
file_name = "보고서.xlsx"
print(file_name.endswith(("xlsx", "xls")))

# 46
file_name = "2020_보고서.xlsx"
print(file_name.startswith("2020"))

# 47
a = "hello world"
print(a.split())

# 48
ticker = "btc_krw"
print(ticker.split("_"))

# 49
date = "2020-05-01"
print(date.split("-"))

# 50
data = "039490     "
print(data.rstrip())

# 51
movie_rank = ["닥터 스트레인지", "스플릿", "럭키"]

# 52
movie_rank.append("배트맨")
print(movie_rank)

# 53
movie_rank.insert(1, "슈퍼맨")
print(movie_rank)

# 54
del movie_rank[3]
print(movie_rank)

# 55
movie_rank.remove("스플릿")
movie_rank.remove("배트맨")
print(movie_rank)

# 56
lang1 = ["C", "C++", "JAVA"]
lang2 = ["Python", "Go", "C#"]
langs = lang1 + lang2
print(langs)

# 57
nums = [1, 2, 3, 4, 5, 6, 7]
print(f"max: {max(nums)}")
print(f"min: {min(nums)}")

# 58
nums = [1, 2, 3, 4, 5]
print(sum(nums))

# 59
cook = [
    "피자",
    "김밥",
    "만두",
    "양념치킨",
    "족발",
    "피자",
    "김치만두",
    "쫄면",
    "소시지",
    "라면",
    "팥빙수",
    "김치전",
]
print(len(cook))

# 60
nums = [1, 2, 3, 4, 5]
print(sum(nums) / len(nums))

# 61
price = ["20180728", 100, 130, 140, 150, 160, 170]
print(price[1:])

# 62
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(nums[::2])

# 63
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(nums[1::2])

# 64
nums = [1, 2, 3, 4, 5]
print(nums[::-1])

# 65
interest = ["삼성전자", "LG전자", "Naver"]
print(interest[0], interest[2])

# 66
interest = ["삼성전자", "LG전자", "Naver", "SK하이닉스", "미래에셋대우"]
print(" ".join(interest))

# 67
interest = ["삼성전자", "LG전자", "Naver", "SK하이닉스", "미래에셋대우"]
print("/".join(interest))

# 68
interest = ["삼성전자", "LG전자", "Naver", "SK하이닉스", "미래에셋대우"]
print("\n".join(interest))

# 69
string = "삼성전자/LG전자/Naver"
interest = string.split("/")
print(interest)

# 70
data = [2, 4, 3, 1, 5, 10, 9]
data.sort()
print(data)

# 71
my_variable = ()

# 72
movie_rank = ("닥터 스트레인지", "스플릿", "럭키")

# 73
my_tuple = (1,)

# 74
# 튜플은 원소 값을 변경할 수 없기 때문.

# 75
t = 1, 2, 3, 4
# tuple

# 76
t = ("a", "b", "c")
t = ("A", "b", "c")

# 77
interest = ("삼성전자", "LG전자", "SK Hynix")
interest_list = list(interest)

# 78
interest = ["삼성전자", "LG전자", "SK Hynix"]
interest_tuple = tuple(interest)

# 79
# apple banana cake

# 80
print(tuple(i for i in range(1, 100, 2)))

# 81
scores = [8.8, 8.9, 8.7, 9.2, 9.3, 9.7, 9.9, 9.5, 7.8, 9.4]
*valid_score, _, _ = scores
print(valid_score)

# 82
_, _, *valid_score = scores
print(valid_score)

# 83
_, *valid_score, _ = scores
print(valid_score)

# 84
temp = {}

# 85
temp = {"메로나": 1000, "폴라포": 1200, "빵빠레": 1800}

# 86
temp["죠스바"] = 1200
temp["월드콘"] = 1500

# 87
print(f"메로나 가격: {temp['메로나']}")

# 88
temp["메로나"] = 1300

# 89
del temp["메로나"]

# 90
# 없는 키 참조

# 91
inventory = {
    "메로나": [300, 20],
    "비비빅": [400, 3],
    "죠스바": [250, 100],
}

# 92
inventory = {"메로나": [300, 20], "비비빅": [400, 3], "죠스바": [250, 100]}
print(inventory["메로나"][0], "원")

# 93
inventory = {"메로나": [300, 20], "비비빅": [400, 3], "죠스바": [250, 100]}
print(inventory["메로나"][1], "개")

# 94
inventory = {"메로나": [300, 20], "비비빅": [400, 3], "죠스바": [250, 100]}
inventory["월드콘"] = [500, 7]

# 95
icecream = {
    "탱크보이": 1200,
    "폴라포": 1200,
    "빵빠레": 1800,
    "월드콘": 1500,
    "메로나": 1000,
}

icecream_names = list(icecream.keys())

# 96
icecream = {
    "탱크보이": 1200,
    "폴라포": 1200,
    "빵빠레": 1800,
    "월드콘": 1500,
    "메로나": 1000,
}
icecream_prices = list(icecream.values())

# 97
icecream = {
    "탱크보이": 1200,
    "폴라포": 1200,
    "빵빠레": 1800,
    "월드콘": 1500,
    "메로나": 1000,
}

icecream_prices = list(icecream.values())
print(sum(icecream_prices))


# 98
icecream = {
    "탱크보이": 1200,
    "폴라포": 1200,
    "빵빠레": 1800,
    "월드콘": 1500,
    "메로나": 1000,
}
new_product = {"팥빙수": 2700, "아맛나": 1000}
icecream.update(new_product)
print(icecream)

# 99
keys = ("apple", "pear", "peach")
vals = (300, 250, 400)
print(dict(zip(keys, vals)))

# 100
date = ["09/05", "09/06", "09/07", "09/08", "09/09"]
close_price = [10500, 10300, 10100, 10800, 11000]
print(dict(zip(date, close_price)))
