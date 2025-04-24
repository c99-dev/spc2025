CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notes (title, content, image_path) VALUES
('1빠', '이것은 첫번째 노트 입니다.', '/images/image1.jpg'),
('2등', '이것은 두번째 노트 입니다.', '/images/image2.jpg'),
('3빠', '이것은 세번째 노트 입니다.', '/images/image3.jpg');