const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#id_password');

  togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

// flash.js
setTimeout(() => {
  const flash = document.querySelector('.flash');
  if (flash) {
    flash.classList.add('hide');
    setTimeout(() => {
      flash.remove();
    }, 1000);
  }
}, 2000);