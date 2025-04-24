CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS notes;

INSERT INTO notes (title, content, image_path) VALUES
('1빠', '이것은 첫번째 노트 입니다.', '/images/ahri.png'),
('2등', '이것은 두번째 노트 입니다.', '/images/garen.png'),
('3빠', '이것은 세번째 노트 입니다.', '/images/mell.png');


select * from notes;