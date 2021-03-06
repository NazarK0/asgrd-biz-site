const form = document.getElementById('register-user-form');

form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const response = await fetch('http://127.0.0.1:5000/api/register', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    window.location.href = '2faNotVerified.html';
    const { id } = await response.json();
    sessionStorage.setItem('id', id)
  } else {
    console.error(response);
    alert(`Ошибка регистрации`);
  }
};
