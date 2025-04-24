function loading() {
  getNotes();
}

async function getNotes() {
  const response = await axios.get('/notes');
  const notes = response.data;

  const notesList = document.querySelector('#notes-list');
  notesList.innerHTML = '';
  notes.forEach((note) => {
    const card = `
      <div class="card" style="width: 17rem;">
        <div class="card-body">
          <h5 class="card-title">${note.title}</h5>
          <p class="card-text">${note.content}</p>
          <button type="button" class="btn btn-info" data-id="${note.id}" onclick="editNote(this)">
            수정
          </button>
          <button type="button" data-id="${note.id}" onclick="deleteNote(this)" class="btn btn-danger">
            삭제
          </button>
        </div>
      </div>
    `;
    notesList.insertAdjacentHTML('beforeend', card);
  });
}

async function saveNote() {
  const inputTitle = document.querySelector('#input-title');
  const inputContent = document.querySelector('#input-content');
  const title = inputTitle.value.trim();
  const content = inputContent.value.trim();

  if (!(title && content)) return alert('제목과 내용을 모두 입력해주세요.');

  const note = {
    title: title,
    content: content,
  };

  const response = await axios.post('/notes', note);
  if (response.status !== 201) return alert('저장 실패');

  const data = response.data;
  alert(data.message);
  inputTitle.value = '';
  inputContent.value = '';
  getNotes();
}

async function deleteNote(el) {
  const id = el.dataset.id;
  const response = await axios.delete(`/notes/${id}`);
  const data = response.data;
  if (response.status !== 200) return alert('삭제 실패');

  alert(data.message);
  getNotes();
}

let prevCard = '';
async function editNote(el) {
  const cardBody = el.parentElement;
  const id = el.dataset.id;
  prevCard = cardBody.innerHTML;
  const prevTitle = cardBody.querySelector('.card-title').innerText;
  const prevContent = cardBody.querySelector('.card-text').innerText;
  cardBody.innerHTML = `
    <input type="text" id="edit-title" placeholder="제목" class="form-control mb-1" value="${prevTitle}" />
    <textarea id="edit-content" placeholder="내용" class="form-control mb-1">${prevContent}</textarea>
    <div>
      <button type="button" class="btn btn-info" data-id="${id}" onclick="updateNote(this)">
        저장
      </button>
      <button type="button" class="btn btn-warning" data-id="${id}" onclick="cancelEdit(this)">
        취소
      </button>
    </div>
  `;
}

async function updateNote(el) {
  const id = el.dataset.id;
  const cardBody = el.parentElement.parentElement;
  const editTitle = cardBody.querySelector('#edit-title');
  const editContent = cardBody.querySelector('#edit-content');
  const updatedNote = {
    title: editTitle.value,
    content: editContent.value,
  };

  const response = await axios.put(`/notes/${id}`, updatedNote);
  if (response.status !== 200) return alert('수정 실패');

  const data = response.data;
  alert(data.message);
  getNotes();
}

function cancelEdit(id) {
  const target = document.querySelector(
    `#notes-list .card:nth-child(${id}) .card-body`
  );
  target.innerHTML = prevCard;
  prevCard = '';
}

addEventListener('DOMContentLoaded', loading);
