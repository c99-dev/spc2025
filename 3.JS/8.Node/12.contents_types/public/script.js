document
  .getElementById('jsonSendButton')
  .addEventListener('click', async () => {
    const data = document.getElementById('jsonInput').value;
    const response = await fetch('/submit-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });
    const result = await response.json();
    const resultDiv = document.getElementById('output');
    resultDiv.textContent = JSON.stringify(result, null, 2);
  });

document.getElementById('formSubmit').addEventListener('click', async (e) => {
  e.preventDefault();

  const name = document.getElementById('formName').value;
  const age = document.getElementById('formAge').value;

  const formData = new URLSearchParams();
  formData.append('name', name);
  formData.append('age', age);

  const response = await fetch('/submit-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  const result = await response.text();
  const resultDiv = document.getElementById('output');
  resultDiv.textContent = result;
});

document
  .getElementById('textSendButton')
  .addEventListener('click', async () => {
    const text = document.getElementById('textInput').value;
    const response = await fetch('/submit-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: text,
    });
    const result = await response.text();
    const resultDiv = document.getElementById('output');
    resultDiv.textContent = result;
  });
