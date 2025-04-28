async function fetchTweet() {
  try {
    // API 엔드포인트 변경 (사용자 이름 포함 가정)
    const response = await fetch('/api/tweets');
    if (!response.ok) {
      console.error('Failed to fetch tweets:', response.statusText);
      return []; // 오류 발생 시 빈 배열 반환
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

async function renderTweet() {
  const tweets = await fetchTweet();
  console.log(tweets);
  const tweetDiv = document.querySelector('.tweets');
  tweetDiv.innerHTML = ''; // 기존 내용을 지웁니다.

  if (!tweets || tweets.length === 0) {
    tweetDiv.innerHTML = '<p>표시할 트윗이 없습니다.</p>';
    return;
  }

  for (const tweet of tweets) {
    const div = document.createElement('div');
    div.classList.add('tweet-card'); // tweet-card 클래스 추가
    // tweet.username 이 API 응답에 포함되어 있다고 가정
    const authorName = tweet.username || `사용자 ${tweet.user_id}`; // username이 없으면 ID 표시
    div.innerHTML = `
      <div class="tweet-header">
        <span class="tweet-author">${authorName}</span>
      </div>
      <div class="tweet-content">
        <p>${tweet.content}</p>
      </div>
      <div class="tweet-footer">
        <button class="like-button">좋아요</button>
        <span class="like-count">좋아요 수: ${tweet.like_count || 0}</span>
      </div>
    `;
    tweetDiv.appendChild(div);
  }
}

// common.js가 먼저 실행된 후 renderTweet 실행되도록 DOMContentLoaded 사용 유지
document.addEventListener('DOMContentLoaded', renderTweet);
