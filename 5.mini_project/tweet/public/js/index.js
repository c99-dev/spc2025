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
    div.classList.add('tweet-card');
    const authorName = tweet.username || `사용자 ${tweet.user_id}`;

    // 좋아요 상태에 따른 버튼 설정
    const isLiked = tweet.liked === 1;
    const likeButtonText = isLiked ? '좋아요 취소' : '좋아요';
    const likeButtonClass = isLiked ? 'like-button liked' : 'like-button';

    div.innerHTML = `
      <div class="tweet-header">
        <span class="tweet-author">${authorName}</span>
      </div>
      <div class="tweet-content">
        <p>${tweet.content}</p>
      </div>
      <div class="tweet-footer">
        <button class="${likeButtonClass}" onclick="toggleLike(${tweet.id})">
          ${likeButtonText}
        </button>
        <span class="like-count">좋아요 수: ${tweet.like_count || 0}</span>
      </div>
    `;
    tweetDiv.appendChild(div);
  }
}

// 좋아요 토글 함수
async function toggleLike(tweetId) {
  try {
    const response = await fetch(`/api/like/${tweetId}`, {
      method: 'POST',
    });

    if (response.ok) {
      console.log('좋아요 상태 변경 성공');
      // UI 업데이트 (여기서는 목록 전체를 다시 렌더링)
      renderTweet();
    } else if (response.status === 401) {
      alert('좋아요를 하려면 로그인이 필요합니다.');
      window.location.href = '/login.html';
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: '알 수 없는 오류' }));
      console.error('좋아요 실패:', errorData.message);
      alert(`좋아요 처리에 실패했습니다: ${errorData.message}`);
    }
  } catch (error) {
    console.error('좋아요 요청 중 오류:', error);
    alert('좋아요 처리 중 오류가 발생했습니다.');
  }
}

// 기존 handleLike 함수 제거 또는 toggleLike로 대체

document.addEventListener('DOMContentLoaded', renderTweet);
