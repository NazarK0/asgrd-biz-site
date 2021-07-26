const logoutButton = document.getElementById('logout-btn');

logoutButton.onclick = () => {
  sessionStorage.removeItem('id');
  window.location.href = 'index.html';
}