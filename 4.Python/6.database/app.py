import sqlite3

conn = sqlite3.connect("users.db")
cursor = conn.cursor()

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL
    )
"""
)
cursor.execute("SELECT COUNT(*) FROM users")
count = cursor.fetchone()[0]

if count == 0:
    cursor.execute("INSERT INTO users (name, age) VALUES (?, ?)", ("Alice", 30))
    cursor.execute("INSERT INTO users (name, age) VALUES (?, ?)", ("Bob", 25))
    conn.commit()
else:
    print(f"이미 데이터가 {count}개 존재합니다.")

cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()

print(rows)

for row in rows:
    print(f"ID: {row[0]}, Name: {row[1]}, Age: {row[2]}")

conn.close()
