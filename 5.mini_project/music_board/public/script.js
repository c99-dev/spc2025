document.addEventListener('DOMContentLoaded', function () {
  // 좋아요 버튼 이벤트 처리
  document.querySelectorAll('.btn-like').forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const musicId = this.getAttribute('data-music-id');

      fetch(`/api/music/${musicId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || '오류가 발생했습니다.');
            });
          }
          return response.json();
        })
        .then((data) => {
          // 좋아요 UI 업데이트
          updateLikeButtonUI(this, data);
        })
        .catch((error) => {
          handleApiError(error);
        });
    });
  });

  // 댓글 폼 제출 이벤트 처리
  document.querySelectorAll('.comment-form').forEach((form) => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const musicId = this.getAttribute('data-music-id');
      const commentInput = this.querySelector('.comment-input');
      const commentContent = commentInput.value.trim();

      if (!commentContent) return;

      fetch(`/api/music/${musicId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || '오류가 발생했습니다.');
            });
          }
          return response.json();
        })
        .then((data) => {
          // 댓글 추가 및 폼 초기화
          commentInput.value = '';
          addCommentToList(data.comment, musicId);
        })
        .catch((error) => {
          handleApiError(error);
        });
    });
  });

  // 커스텀 이벤트를 통한 로그인 모달 표시 처리
  document.addEventListener('showLoginRequired', function () {
    showLoginModal();
  });

  // 댓글 수정 모달 저장 버튼 이벤트
  const saveEditButton = document.getElementById('saveEditComment');
  if (saveEditButton) {
    saveEditButton.addEventListener('click', function () {
      const commentId = document.getElementById('editCommentId').value;
      const content = document
        .getElementById('editCommentContent')
        .value.trim();

      if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }

      fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || '오류가 발생했습니다.');
            });
          }
          return response.json();
        })
        .then((data) => {
          // UI 업데이트
          updateCommentInList(data.comment);
          // 모달 닫기
          const editModal = bootstrap.Modal.getInstance(
            document.getElementById('editCommentModal')
          );
          editModal.hide();
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }

  // 페이지 로드 시 기존 댓글들에 이벤트 리스너 연결
  document.querySelectorAll('.comment-item').forEach((item) => {
    attachCommentEventListeners(item);
  });

  // 좋아요 버튼 UI 업데이트 함수
  function updateLikeButtonUI(button, data) {
    const countElement = button.querySelector('.like-count');
    if (countElement) {
      countElement.textContent = data.likeCount;
    }
    const icon = button.querySelector('i');
    if (data.liked) {
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-danger');
      icon.classList.remove('bi-heart');
      icon.classList.add('bi-heart-fill');
    } else {
      button.classList.add('btn-outline-danger');
      button.classList.remove('btn-danger');
      icon.classList.add('bi-heart');
      icon.classList.remove('bi-heart-fill');
    }
  }

  // API 오류 처리 함수
  function handleApiError(error) {
    if (error.message === '로그인이 필요합니다') {
      showLoginModal();
    } else {
      alert(error.message);
    }
  }

  // 댓글 목록에 새 댓글 추가하는 함수
  function addCommentToList(comment, musicId) {
    const commentsList = document.querySelector(`#comments-list-${musicId}`);
    if (!commentsList) return;

    const commentItem = createCommentElement(comment);
    commentsList.prepend(commentItem);
    attachCommentEventListeners(commentItem); // 새로 추가된 요소에 이벤트 리스너 연결
    updateCommentCount(musicId, 1); // 댓글 수 증가
  }

  // 댓글 요소 생성 함수
  function createCommentElement(comment) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item border-bottom py-3';
    commentItem.setAttribute('data-comment-id', comment.id); // ID 속성 추가

    commentItem.innerHTML = `
      <div class="d-flex justify-content-between">
        <div class="fw-bold">${comment.username}</div>
        <small class="text-muted">${formatDate(comment.created_at)}</small>
      </div>
      <div class="comment-content mt-2">${comment.content}</div>
      <div class="mt-2 text-end">
        <button class="btn btn-sm btn-outline-secondary edit-comment-btn">수정</button>
        <button class="btn btn-sm btn-outline-danger delete-comment-btn">삭제</button>
      </div>
    `;
    return commentItem;
  }

  // 댓글 목록에서 댓글 업데이트하는 함수
  function updateCommentInList(comment) {
    const commentElement = document.querySelector(
      `.comment-item[data-comment-id="${comment.id}"]`
    );
    if (commentElement) {
      commentElement.querySelector('.comment-content').textContent =
        comment.content;
      // 시간 업데이트는 생략하거나 필요시 추가
    }
  }

  // 댓글 수정/삭제 버튼에 이벤트 리스너 연결 함수
  function attachCommentEventListeners(commentElement) {
    // 이미 리스너가 연결되었는지 확인 (data 속성 사용)
    if (commentElement.dataset.listenersAttached === 'true') {
      return; // 이미 연결됨, 중복 방지
    }

    const commentId = commentElement.getAttribute('data-comment-id');

    // 수정 버튼
    const editBtn = commentElement.querySelector('.edit-comment-btn');
    if (editBtn) {
      editBtn.addEventListener('click', function () {
        const commentContent =
          commentElement.querySelector('.comment-content').textContent;
        document.getElementById('editCommentId').value = commentId;
        document.getElementById('editCommentContent').value = commentContent;
        const editModal = new bootstrap.Modal(
          document.getElementById('editCommentModal')
        );
        editModal.show();
      });
    }

    // 삭제 버튼
    const deleteBtn = commentElement.querySelector('.delete-comment-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

        fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                throw new Error(data.error || '오류가 발생했습니다.');
              });
            }
            return response.json();
          })
          .then(() => {
            const musicIdElement = commentElement.closest(
              '[id^="comments-list-"]'
            );
            if (musicIdElement) {
              const musicId = musicIdElement.id.split('-').pop();
              commentElement.remove();
              updateCommentCount(musicId, -1); // 댓글 수 감소
            } else {
              // musicId를 찾지 못한 경우의 예외 처리 (예: 콘솔 로그)
              console.error(
                'Music ID를 포함하는 상위 요소를 찾을 수 없습니다.'
              );
              commentElement.remove(); // 일단 댓글은 삭제
            }
          })
          .catch((error) => {
            alert(error.message);
          });
      });
    }

    // 리스너 연결 완료 플래그 설정
    commentElement.dataset.listenersAttached = 'true';
  }

  // 댓글 개수 업데이트 함수
  function updateCommentCount(musicId, change) {
    const countElement = document.querySelector(`#comment-count-${musicId}`);
    if (countElement) {
      const currentCount = parseInt(countElement.textContent) || 0;
      countElement.textContent = Math.max(0, currentCount + change);
    }
  }

  // 날짜 형식 변환 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // 초

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }

  // 로그인 요청 모달 표시 함수
  window.showLoginModal = function () {
    const loginModal = document.getElementById('loginRequiredModal');
    if (loginModal && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(loginModal);
      modal.show();
    } else {
      if (
        confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')
      ) {
        window.location.href = '/auth/login';
      }
    }
  };

  // 토스트 메시지 표시 함수
  function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    toastContainer.appendChild(toast);

    if (typeof bootstrap !== 'undefined') {
      const toastInstance = new bootstrap.Toast(toast, { delay: 3000 });
      toastInstance.show();
      toast.addEventListener('hidden.bs.toast', () => toast.remove());
    } else {
      setTimeout(() => toast.remove(), 3000);
    }
  }
});
