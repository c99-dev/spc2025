-- 외래키 제약 조건을 비활성화하여 순서에 상관없이 삭제 가능하도록 설정
PRAGMA foreign_keys = OFF;
-- 모든 테이블의 데이터 삭제
DELETE FROM music_tags;
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM tags;
DELETE FROM music;
DELETE FROM users;
-- 테이블의 자동 증가 ID 초기화 (SQLite에서 사용)
DELETE FROM sqlite_sequence
WHERE name IN (
        'users',
        'music',
        'tags',
        'likes',
        'comments',
        'music_tags'
    );
-- 외래키 제약 조건 다시 활성화
PRAGMA foreign_keys = ON;
INSERT INTO users (username, password, name, is_admin)
VALUES ('admin', 'admin', '관리자', 1),
    -- 관리자 계정
    ('user1', 'password1', '김테스트', 0),
    -- 일반 사용자 1
    ('user2', 'password2', '이음악', 0);
-- 일반 사용자 2
-- 예상되는 user id: 1, 2, 3
-- 태그 데이터 삽입
INSERT INTO tags (name)
VALUES ('발라드'),
    -- tag id: 1
    ('댄스'),
    -- tag id: 2
    ('아이돌'),
    -- tag id: 3
    ('K-Pop'),
    -- tag id: 4
    ('감성');
-- tag id: 5
-- 음악 데이터 삽입
-- release_date는 'YYYY-MM-DD' 형식으로 저장합니다.
INSERT INTO music (title, artist)
VALUES ('밤편지', '아이유'),
    -- music id: 1
    ('Dynamite', 'BTS'),
    -- music id: 2
    ('취중진담', '전람회'),
    -- music id: 3
    ('Next Level', 'aespa'),
    -- music id: 4
    ('봄날', 'BTS'),
    -- music id: 5
    (
        '어떻게 이별까지 사랑하겠어, 널 사랑하는 거지',
        'AKMU'
    );
-- music id: 6
-- 음악-태그 연결 데이터 삽입
-- 각 음악에 적절한 태그를 연결합니다.
INSERT INTO music_tags (music_id, tag_id)
VALUES (1, 1),
    -- 밤편지 -> 발라드
    (1, 5),
    -- 밤편지 -> 감성
    (2, 2),
    -- Dynamite -> 댄스
    (2, 3),
    -- Dynamite -> 아이돌
    (2, 4),
    -- Dynamite -> K-Pop
    (3, 1),
    -- 취중진담 -> 발라드
    (3, 5),
    -- 취중진담 -> 감성
    (4, 2),
    -- Next Level -> 댄스
    (4, 3),
    -- Next Level -> 아이돌
    (4, 4),
    -- Next Level -> K-Pop
    (5, 3),
    -- 봄날 -> 아이돌
    (5, 4),
    -- 봄날 -> K-Pop
    (5, 5),
    -- 봄날 -> 감성
    (6, 1),
    -- 어떻게 이별까지... -> 발라드
    (6, 5);
-- 어떻게 이별까지... -> 감성
-- 좋아요 데이터 삽입
-- 사용자들이 음악에 좋아요를 누른 기록입니다.
INSERT INTO likes (user_id, music_id)
VALUES (2, 1),
    -- testuser1가 '밤편지' 좋아요
    (2, 5),
    -- testuser1가 '봄날' 좋아요
    (3, 1),
    -- musiclover가 '밤편지' 좋아요
    (3, 4),
    -- musiclover가 'Next Level' 좋아요
    (3, 6),
    -- musiclover가 '어떻게 이별까지...' 좋아요
    (1, 2);
-- admin_user가 'Dynamite' 좋아요
-- 댓글 데이터 삽입
-- 사용자들이 음악에 댓글을 남긴 기록입니다.
INSERT INTO comments (user_id, music_id, content)
VALUES (2, 1, '언제 들어도 좋은 노래 ㅠㅠ'),
    -- testuser1가 '밤편지'에 댓글
    (3, 1, '아이유 목소리 최고!'),
    -- musiclover가 '밤편지'에 댓글
    (2, 4, '넥스트 레벨~ 중독성 있어요!'),
    -- testuser1가 'Next Level'에 댓글
    (3, 6, '가사가 너무 슬퍼요...'),
    -- musiclover가 '어떻게 이별까지...'에 댓글
    (1, 5, 'BTS 봄날은 명곡이죠.');
-- admin_user가 '봄날'에 댓글