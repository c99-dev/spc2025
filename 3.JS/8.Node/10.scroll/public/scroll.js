document.addEventListener('DOMContentLoaded', function () {
  const scrollContainer = document.querySelector('.scroll-container');

  fetch('/items').then((response) => {
    response.json().then((data) => {
      data.forEach((item) => {
        const div = document.createElement('div');
        div.textContent = item;
        scrollContainer.appendChild(div);
      });
    });
  });
});
