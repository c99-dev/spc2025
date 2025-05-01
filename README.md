# 과제 체크 리스트

1. 강사님이 제공한 예제와 다른 나만의 차별점 두기

   - 사소한 것이라도 좋으니 가능하면 차별점 두기
   - 예를 들어 색상, 레이아웃, 기능 추가 구현 등
   - 기능 추가 구현이 가장 좋음

2. 명명에 항상 의미를 담기

   - 변수명
     - `a`라는 변수명은 `a`가 무엇을 의미하는지 알 수 없음
     - 명사가 아닌 동사로 시작하는 경우는 `is`, `has`, `can` 등으로 시작하기
   - 함수명
     - 전치사 `to`, `for`, `of`를 사용하여 의미를 담기
     - `by`, `with`, `in`, `on`, `at` 등도 적절하게 사용하기
   - URL
     - RestFul API를 사용할 때는 URL에 의미를 담기
     - 예를 들어, `GET /users`는 모든 사용자를 가져오는 것이고, `GET /users/1`은
       id 가 1인 사용자를 가져오는 것
     - 단수형과 복수형을 적절하게 사용하기

3. 목적을 달성하고 나면 리팩토링하기

   - 리팩토링을 통해 가독성을 높이고, 유지보수성을 높이기
   - 중복되는 코드를 줄이고 의미 단위로 구분하기
   - 하나의 함수는 하나의 기능만 수행하도록 하기

## 목차

- [과제 체크 리스트](#과제-체크-리스트)
  - [목차](#목차)
  - [2.CSS](#2css)
  - [3.JS](#3js)
    - [1.DOM](#1dom)
    - [2.Event](#2event)
    - [3.MiniApp](#3miniapp)
    - [4.Canvas](#4canvas)
    - [6.Library_Bootstrap](#6library_bootstrap)
    - [7.Fetch](#7fetch)
    - [8.Node](#8node)
      - [2.function](#2function)
      - [4.class](#4class)
      - [6.express](#6express)
      - [10.scroll](#10scroll)
      - [11.chatbot](#11chatbot)
    - [9.Project](#9project)
      - [4.session_cart](#4session_cart)
  - [4.Python](#4python)
    - [1.basic](#1basic)
    - [3.scrap](#3scrap)
    - [5.flask](#5flask)
      - [5.chatbot_echo](#5chatbot_echo)
      - [6.chatbot_recommend](#6chatbot_recommend)
  - [5.mini_project](#5mini_project)
    - [1. notepad_v1.0](#1-notepad_v10)
    - [2. notepad_v2.0](#2-notepad_v20)
    - [3. music_board](#3-music_board)
    - [4. crm](#4-crm)
    - [5. movie_chatgpt](#5-movie_chatgpt)
    - [6. tweet](#6-tweet)

## 2.CSS

- [x] [CSS Animation으로 로그인 페이지 디자인](https://github.com/c99-dev/spc2025/tree/main/2.CSS/papper_login)

- [x] [넷플릭스 HTML/CSS 클론](https://github.com/c99-dev/spc2025/tree/main/2.CSS/netflix_clone)
  - 이미지 그라데이션에 신경을 많이 씀
  - 배너의 볼록하게 잘린 부분을 `clip-path: polygon()`을 사용하여 구현

## 3.JS

### 1.DOM

- [x] [계산기3 에러처리](https://github.com/c99-dev/spc2025/blob/main/3.JS/1.DOM/14.caculator2.html)

### 2.Event

- [x] [드래그 앤 드랍 3개](https://github.com/c99-dev/spc2025/blob/main/3.JS/2.Event/11.draganddrop3.html)

### 3.MiniApp

- [x] [스톱워치](https://github.com/c99-dev/spc2025/blob/main/3.JS/3.MiniApp/7.stopwatch.html)
  - `requestAnimationFrame()`을 사용하여 스톱워치 구현
  - 00:00.000 단위로 스톱워치 구현 -> 모니터 주사율에 따라 최소로 더해지면서 보
    여지는 시간이 다름

### 4.Canvas

- [x] [팩맨 게임](https://github.com/c99-dev/spc2025/blob/main/3.JS/4.Canvas/pacman)

  - 방향에 따라 팩맨이 회전하도록 구현
  - [[블로그] Canvas의 Arc 관련 글 작성](https://velog.io/@c99/JavaScript-Canvas%EB%A5%BC-%EB%B0%B0%EC%9A%B0%EB%A9%B0-%EC%9D%B4%ED%95%B4-%EB%AA%BB%ED%95%9C-%ED%95%9C-%EA%B0%80%EC%A7%80-CanvasRenderingContext2D-arc-%EB%A9%94%EC%84%9C%EB%93%9C)

- [x] [스네이크 게임](https://github.com/c99-dev/spc2025/blob/main/3.JS/4.Canvas/snake)
  - 머리가 몸에 닿거나, 벽에 부딫일 때 게임 오버 추가

### 6.Library_Bootstrap

- [x] [로그인 폼 디자인](https://github.com/c99-dev/spc2025/blob/main/3.JS/6.Library/3.Bootstrap/5.form.html)

- [x] [다크 모드](https://github.com/c99-dev/spc2025/blob/main/3.JS/6.Library/3.Bootstrap/table.html)

### 7.Fetch

- [x] [로딩 버튼](https://github.com/c99-dev/spc2025/blob/main/3.JS/7.Fetch/fetchButton.html)

### 8.Node

#### 2.function

- [x] [별 찍기](https://github.com/c99-dev/spc2025/blob/main/3.JS/8.Node/2.function/4.triangle.js)
  - `String.prototype.repeat()` 메서드를 사용하여 별 찍기 구현

#### 4.class

- [x] [객체지향2 설계](https://github.com/c99-dev/spc2025/blob/main/3.JS/8.Node/4.class/familyCar)

  - 차량에 누가 탑승했는지 확인
  - 최대 탑승자 수 제한
  - 차량이 달리는 중에 탑승 불가능
  - `get`, `set` 키워드와 `#`-> private 키워드 사용

- [x] [객체지향 설계](https://github.com/c99-dev/spc2025/blob/main/3.JS/8.Node/4.class/person)

#### 6.express

- [x] [모달 창 구현 JS](https://github.com/c99-dev/spc2025/blob/main/3.JS/8.Node/6.express/8.app_users_modal.js)
      [모달 창 구현 HTML](https://github.com/c99-dev/spc2025/blob/main/3.JS/8.Node/6.express/public/users_modal.html)
  - Bootstrap을 사용하여 모달 창 구현
  - 테이블의 각 행을 클릭하여 수정, 삭제 가능한 모달 창

#### 10.scroll

- [x] [무한 스크롤](https://github.com/c99-dev/spc2025/blob/main/3.JS/8.Node/10.scroll)
  - 스크롤의 사용성을 위해 끝에 닿을 때가 아닌, 스크롤이 도착하기 직전에 데이터
    를 불러옴
  - 여러번 이벤트가 실행되는 문제 때문에 throttle로 구현한 것을 `isFetching` 플
    래그 변수를 추가하여 DOM이 그려진 후 작동하도록 개선

#### 11.chatbot

- [x] [챗봇 UI 에코서버](https://github.com/c99-dev/spc2025/blob/main/3.JS/8.Node/11.chatbot)
  - [ ] SSE(server-sent event)를 사용하여 실시간으로 데이터 전송
    - 서버에서 클라이언트로 단방향 데이터 전송
    - 화면에 한글자씩 나오도록 구현

### 9.Project

#### 4.session_cart

- [x] [세션 활용 쇼핑 사이트](https://github.com/c99-dev/spc2025/tree/main/3.JS/9.project/4.session_cart)
  - [x] 장바구니에 담긴 상품 삭제하기
  - [x] 장바구니에 담긴 상품 수량 변경하기
  - [x] 장바구니에 담긴 상품 총 가격 계산하기
  - [x] 관리자 페이지 추가 구현

## 4.Python

### 1.basic

- [x] [별찍기](https://github.com/c99-dev/spc2025/blob/main/4.Python/1.basic/print_star.py)
- [ ] [Python 300제](https://github.com/c99-dev/spc2025/tree/main/4.Python/1.basic/problem300)
  - [x] 1~100
  - [ ] 101~199
  - [ ] 201~300

### 3.scrap

- [x] [네이버 뉴스 스크래핑](https://github.com/c99-dev/spc2025/blob/main/4.Python/3.scrap/11.naversportsnews.py)

  - `playwright`를 사용하여 네이버 스포츠 뉴스 스크래핑
  - `asyncio`를 사용하여 여러 링크를 비동기적으로 스크래핑

- [x] [영화 차트 스크래핑](https://github.com/c99-dev/spc2025/blob/main/4.Python/3.scrap/moviechart)
  - `playwright` 를 사용하여 영화 차트 스크래핑
    - [x] 제목, 이미지경로, 상세페이지링크
    - [x] 로컬내PC에 이미지 저장하기
    - [x] 상세페이지링크를 타고 들어가서 시놉시스(줄거리) 가져오기
    - [x] csv에 저장하기 및 json 으로도 저장해보기

### 5.flask

#### 5.chatbot_echo

- [클라이언트](https://github.com/c99-dev/spc2025/tree/main/3.JS/9.project/2.chatbot)
- [x] [챗봇 에코 서버](https://github.com/c99-dev/spc2025/blob/main/4.Python/5.flask/5.chatbot_echo/app.py)

#### 6.chatbot_recommend

- [클라이언트](https://github.com/c99-dev/spc2025/tree/main/3.JS/9.project/2.chatbot)
- [x] [챗봇 추천 서버](https://github.com/c99-dev/spc2025/tree/main/4.Python/5.flask/6.chatbot_recommend)
  - 추천 입력 시 모든 영화 중 랜덤한 영화를 한 개 추천 구현
  - 추천 영화 하이라이팅 및 스크롤 이동 구현

## 5.mini_project

### 1. notepad_v1.0

- [x] [메모장 1.0](https://github.com/c99-dev/spc2025/tree/main/5.mini_project/notepad_v1.0)
  - [x] 기본 틀 밑 읽기/쓰기/삭제 완료 (1~2시간)
  - [x] 작성글 수정까지 완료 (~1시간)
  - [x] 디자인 배치 살펴보기 (row정렬, column정렬)

### 2. notepad_v2.0

- [x] [메모장 2.0](https://github.com/c99-dev/spc2025/tree/main/5.mini_project/notepad_v2.0)
  - [x] 위 메모장을 기반으로 사진 첨부 추가 (1~2시간)
  - [x] 사진 삭제 시 서버의 파일도 삭제되도록 (중복파일 삭제 등도 해볼것 - 제 사
        이 트도 이미 중복파일이슈가 남아있는 상태임)

### 3. music_board

- [x] [음악 게시판](https://github.com/c99-dev/spc2025/tree/main/5.mini_project/music_board)
  - [x] 음악(샘플데이터 20여개 추가) 검색 (title/artist/hashtag) (2~3시간)
  - [x] 회원가입 및 로그인 (1시간)
  - [x] 좋아요 및 취소 기능, 내 댓글 및 좋아요 한 글 확인 (2시간)
  - [x] 관리자페이지 (회원관리/댓글관리) (2~3시간)
  - [x] 알림기능 (내가 좋아요 한 글의 댓글 알림) - Notification (2시간)

### 4. crm

- [ ] [고객 관리 포털]()

### 5. movie_chatgpt

- [x] 이전 미션에서 구현 완료
- [x] [6.chatbot_recommend](#6chatbot_recommend)
  - [x] 영화 랭킹 크롤링 및 DB에 추가 (~1시간)
  - [x] 영화 랭킹 DB로부터 화면에 표시 (~1시간)
  - [x] 챗봇 화면에 추가 (~1시간)
  - [x] 챗봇을 통한 검색 ("추천") (~1시간)

### 6. tweet

- [x] [트위터 사이트](https://github.com/c99-dev/spc2025/tree/main/5.mini_project/tweet)
  - [x] 회원가입 (~1시간)
  - [x] 트윗 글작성 (~30분)
  - [x] 좋아요/취소 (~1시간)
