PRAGMA foreign_keys = OFF;
DELETE FROM music_tags;
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM tags;
DELETE FROM music;
DELETE FROM users;
DELETE FROM sqlite_sequence
WHERE name IN (
        'users',
        'music',
        'tags',
        'likes',
        'comments',
        'music_tags'
    );
PRAGMA foreign_keys = ON;
INSERT INTO users (username, password, name, is_admin)
VALUES ('admin', 'admin', '관리자', 1),
    ('user1', 'password1', '김테스트', 0),
    ('user2', 'password2', '이음악', 0);
INSERT INTO tags (name)
VALUES ('발라드'),
    ('댄스'),
    ('아이돌'),
    ('K-Pop'),
    ('감성');
INSERT INTO music (title, artist)
VALUES ('밤편지', '아이유'),
    ('Dynamite', 'BTS'),
    ('취중진담', '전람회'),
    ('Next Level', 'aespa'),
    ('봄날', 'BTS'),
    (
        '어떻게 이별까지 사랑하겠어, 널 사랑하는 거지',
        'AKMU'
    );
INSERT INTO music_tags (music_id, tag_id)
VALUES (1, 1),
    (1, 5),
    (2, 2),
    (2, 3),
    (2, 4),
    (3, 1),
    (3, 5),
    (4, 2),
    (4, 3),
    (4, 4),
    (5, 3),
    (5, 4),
    (5, 5),
    (6, 1),
    (6, 5);
INSERT INTO likes (user_id, music_id)
VALUES (2, 1),
    (2, 5),
    (3, 1),
    (3, 4),
    (3, 6),
    (1, 2);
INSERT INTO comments (user_id, music_id, content)
VALUES (2, 1, '언제 들어도 좋은 노래 ㅠㅠ'),
    (3, 1, '아이유 목소리 최고!'),
    (2, 4, '넥스트 레벨~ 중독성 있어요!'),
    (3, 6, '가사가 너무 슬퍼요...'),
    (1, 5, 'BTS 봄날은 명곡이죠.');