nums = [num for num in range(1, 11)]
print("1번 결과", nums)

even_nums = [num for num in nums if num % 2 == 0]
print("2번 결과", even_nums)

word = "hello"
upper_letters = [char.upper() for char in word]
print("3번 결과", upper_letters)

words = ["apple", "banana", "cherry", "egg"]
short_words = [word for word in words if len(word) <= 3]
print("4번 결과", short_words)
