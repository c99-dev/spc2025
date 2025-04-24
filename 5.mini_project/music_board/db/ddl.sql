-- 기존 테이블이 존재한다면 모두 삭제
DROP TABLE IF EXISTS music_tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS music;
DROP TABLE IF EXISTS users;
-- 외래 키 제약 조건 활성화 (세션마다 실행하거나 DB 연결 시 설정)
PRAGMA foreign_keys = ON;
-- 사용자 테이블
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 사용자 고유 번호 (자동 증가)
    username TEXT UNIQUE NOT NULL,
    -- 사용자 로그인 ID (고유, 필수)
    password TEXT NOT NULL,
    -- 비밀번호 (해싱된 값 저장, 필수)
    name TEXT NOT NULL,
    -- 사용자 이름/닉네임 (필수)
    is_admin INTEGER DEFAULT 0 NOT NULL -- 관리자 여부 (0: 일반, 1: 관리자, 기본값 0, 필수)
);
-- 음악 테이블
CREATE TABLE music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 음악 고유 번호 (자동 증가)
    title TEXT NOT NULL,
    -- 곡 제목 (필수)
    artist TEXT NOT NULL -- 아티스트명 (필수)
);
-- 태그 정보 테이블
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 태그 고유 번호 (자동 증가)
    name TEXT UNIQUE NOT NULL -- 태그 이름 (고유, 필수)
);
-- 좋아요 테이블
CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 좋아요 고유 번호 (자동 증가)
    user_id INTEGER NOT NULL,
    -- 좋아요 누른 사용자 ID (필수)
    music_id INTEGER NOT NULL,
    -- 좋아요 대상 음악 ID (필수)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- 좋아요 누른 시각 (필수)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- 사용자가 삭제되면 좋아요도 삭제
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE,
    -- 음악이 삭제되면 좋아요도 삭제
    UNIQUE (user_id, music_id) -- 한 사용자는 한 곡에 대해 좋아요를 한 번만 가능
);
-- 댓글 테이블
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 댓글 고유 번호 (자동 증가)
    user_id INTEGER NOT NULL,
    -- 댓글 작성자 ID (필수)
    music_id INTEGER NOT NULL,
    -- 댓글 대상 음악 ID (필수)
    content TEXT NOT NULL,
    -- 댓글 내용 (필수)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- 댓글 작성 시각 (필수)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- 사용자가 삭제되면 댓글도 삭제
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE -- 음악이 삭제되면 댓글도 삭제
);
-- 음악-태그 연결 테이블 (다대다 관계)
CREATE TABLE music_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 연결 고유 번호 (자동 증가)
    music_id INTEGER NOT NULL,
    -- 해당 음악 ID (필수)
    tag_id INTEGER NOT NULL,
    -- 해당 태그 ID (필수)
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE,
    -- 음악 삭제 시 연결 삭제
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    -- 태그 삭제 시 연결 삭제
    UNIQUE (music_id, tag_id) -- 한 음악에 같은 태그 중복 방지
);
-- 인덱스 생성 (검색 성능 향상 목적)
CREATE INDEX idx_music_title ON music(title);
CREATE INDEX idx_music_artist ON music(artist);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_comments_music_id ON comments(music_id);
CREATE INDEX idx_likes_music_id ON likes(music_id);
CREATE INDEX idx_music_tags_music_id ON music_tags(music_id);
CREATE INDEX idx_music_tags_tag_id ON music_tags(tag_id);