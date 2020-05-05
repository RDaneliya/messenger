'use strict';
const registerForm         = document.getElementsByClassName('register-form')[0];
const loginInput           = document.getElementsByClassName('login-input')[0];
const passwordInput        = document.getElementsByClassName('password-input')[0];
const passwordConfirmation = document.getElementsByClassName('password-input-confirmation')[0];
const registerBtn          = document.getElementsByClassName('btn-register')[0];

const urlPage    = window.location.href;
const url        = urlPage.substring(0, urlPage.lastIndexOf('/'));

function checkExistence(username, callback) {

  const requestUrl = `${url}/exists:${username}`;

  const xhr              = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const exists = JSON.parse(xhr.response).exists;
      callback(exists);
    }
  };
  xhr.open('GET', requestUrl, true);
  xhr.send();
}

function generateKey(username, password) { //Функция генерирования RSA ключей
  const passphrase = username + password;
  const bits       = 1024; //Если больше, будет очень долго генериться

  const privateKey = cryptico.generateRSAKey(passphrase, bits);
  const publicKey  = cryptico.publicKeyString(privateKey);

  localStorage.setItem('private-key', JSON.stringify(privateKey));
  localStorage.setItem('public-key', publicKey);
}


registerForm.onsubmit = () => {
  event.preventDefault();

  const username        = loginInput.value;
  const password        = passwordInput.value;
  const anotherPassword = passwordConfirmation.value;

  if (password !== anotherPassword) {
    alert('Пароли не совпадают');
    return;
  }

  checkExistence(username, (exists) => {
    if (!exists) {
      generateKey(username, password);

      const user = {
        username: username,
        key:      localStorage.getItem('public-key')
      };

      const urlPage    = window.location.href;
      const url        = urlPage.substring(0, urlPage.lastIndexOf('/'));
      const requestUrl = `${url}/create`;

      const urlMain     = document.URL.substring(0, document.URL.lastIndexOf('/'));

      const xhr              = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const successful = JSON.parse(xhr.response).successful;
          if (!successful) {
          } else {
            window.open(urlMain,'_self')
          }
        }
      };

      xhr.open('POST', requestUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(user));

    }
    else
      alert('Такой пользователь уже существует')
  });
};