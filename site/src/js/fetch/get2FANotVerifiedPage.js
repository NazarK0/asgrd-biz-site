const QRimage = document.getElementById('qr-img');
const secretKeyInput = document.getElementById('secret-key');
const userIdInput = document.getElementById('userId');

const get2FANotVerifiedPage = async () => {
  const id = sessionStorage.getItem('id');
  userIdInput.value = id;

  const response = await fetch(`http://127.0.0.1:5000/api/2fa/${id}`);

  if (response.ok) {
    const { secret, verifyQR } = await response.json();

    QRimage.src = verifyQR;
    secretKeyInput.value = secret;

  } else {
    console.error(response);
    alert(`Ошибка 2fa`);
  }
};

get2FANotVerifiedPage()
  .catch(error => {
    console.error(error)
  })
