DROP TABLE IF EXISTS music_tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS music;
DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0 NOT NULL
);
CREATE TABLE music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL
);
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    music_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE,
    UNIQUE (user_id, music_id)
);
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    music_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE
);
CREATE TABLE music_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    music_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE (music_id, tag_id)
);
CREATE INDEX idx_music_title ON music(title);
CREATE INDEX idx_music_artist ON music(artist);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_comments_music_id ON comments(music_id);
CREATE INDEX idx_likes_music_id ON likes(music_id);
CREATE INDEX idx_music_tags_music_id ON music_tags(music_id);
CREATE INDEX idx_music_tags_tag_id ON music_tags(tag_id);