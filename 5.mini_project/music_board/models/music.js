const db = require('../db/connection');

const searchMusic = (searchText) => {
  // 제목, 가수, 해시태그에서 검색어가 포함된 음악 찾기
  const query = `
        SELECT m.id, m.title, m.artist, GROUP_CONCAT(t.name) as tags 
        FROM music m
        LEFT JOIN music_tags mt ON m.id = mt.music_id
        LEFT JOIN tags t ON mt.tag_id = t.id
        WHERE m.title LIKE ? OR m.artist LIKE ? OR t.name LIKE ?
        GROUP BY m.id
    `;
  return db
    .prepare(query)
    .all(`%${searchText}%`, `%${searchText}%`, `%${searchText}%`);
};

module.exports = {
  searchMusic,
};
