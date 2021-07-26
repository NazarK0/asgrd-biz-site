const form = document.getElementById('2fa-verified-form');


form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const response = await fetch('http://127.0.0.1:5000/api/2fa', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    window.location.href = 'securePage.html';
  } else {
    console.error(response);
    alert(`Ошибка регистрации`);
  }
};
