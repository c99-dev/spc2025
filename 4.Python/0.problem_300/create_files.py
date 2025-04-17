# 터미널 위치에 파일 300개 만들기
# 푼 문제는 언더바를 지우자..
for i in range(1, 301):
    with open(f"_{i}.py", "w") as f:
        f.write("")
