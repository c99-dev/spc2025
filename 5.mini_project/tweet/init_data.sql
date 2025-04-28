PRAGMA foreign_keys = OFF;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS tweet;
DROP TABLE IF EXISTS like;

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tweet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
CREATE TABLE IF NOT EXISTS like (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tweet_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (tweet_id) REFERENCES tweet(id)
);
DELETE FROM user;
DELETE FROM tweet;
DELETE FROM like;
INSERT INTO user(username, email, password)
VALUES ('user1', 'user1@example.com', 'password1'),
    ('user2', 'user2@example.com', 'password2'),
    ('user3', 'user3@example.com', 'password3');
INSERT INTO tweet(user_id, content)
VALUES (1, '안녕하세요! 첫 트윗입니다.'),
    (2, '오늘 하루 정말 좋았어요!'),
    (3, 'SQL 배우는 건 재밌어요!');
PRAGMA foreign_keys = ON;