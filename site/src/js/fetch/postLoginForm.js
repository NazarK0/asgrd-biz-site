const form = document.getElementById('login-user-form');

form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const response = await fetch('http://127.0.0.1:5000/api/login', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const { id } = await response.json();
    sessionStorage.setItem('id', id);
    window.location.href = '2faVerified.html';
  } else {
    console.error(response);
    alert(`Ошибка авторизации`);
  }
};
