'use strict';
const loginInput    = document.getElementsByClassName('login-input')[0];
const passwordInput = document.getElementsByClassName('password-input')[0];
const loginForm     = document.getElementsByClassName('login-form')[0];
const loginBtn      = document.getElementsByClassName('btn-login')[0];

const urlPage = window.location.href;
const url     = urlPage.substring(0, urlPage.lastIndexOf('/'));

function checkExistence(username, callback) {

  const requestUrl = `${url}/exists:${username}`;

  const xhr              = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const exists = xhr.response;

      callback(exists);
    }
  };
  xhr.open('GET', requestUrl, true);
  xhr.send();
}

function sendData(username, key, callback) {
  const encodedUsername = encodeURIComponent(username);
  const encodedKey      = encodeURIComponent(key);
  const query           = `?user=${encodedUsername}&key=${encodedKey}`;
  const requestUrl      = `${url}/login${query}`;

  const user = {
    username: username,
    key:      key
  };

  const xhr              = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const status = xhr.status;
      callback(status, requestUrl);
    }
  };
  xhr.open('GET', requestUrl, true);
  xhr.setRequestHeader('Content-Type', 'text/html');
  xhr.send(JSON.stringify(user));
}

function generateKey(username, password) { //Функция генерирования RSA ключей
  const passphrase = username + password;
  const bits       = 1024; //Если больше, будет очень долго генериться


  const privateKey = cryptico.generateRSAKey(passphrase, bits);
  const publicKey  = cryptico.publicKeyString(privateKey);
  console.log(privateKey);
  localStorage.setItem('private-key', JSON.stringify(privateKey));
  localStorage.setItem('public-key', publicKey);
}

function getPrivateKey() {
  const keyJson = localStorage.getItem('private-key');
  return JSON.parse(keyJson);
}

loginForm.onsubmit = () => {

  event.preventDefault();
  const username = loginInput.value;
  const password = passwordInput.value;

  checkExistence(username, (exists) => {
    if (exists) {
      generateKey(username, password);

      const publicKey = localStorage.getItem('public-key');
      console.log(exists);
      sendData(username, publicKey, (status, requestUrl) => {
        console.log(status);
        switch (status) {
          case 403:
            alert('Неверный логин или пароль');
            break;

          case 500:
            alert('Что-то пошло не так');
            break;

          case 304:
          case 200:
            window.open(`${url}/chat?username=${username}`, '_self');
            break;
        }

      });
    } else
      alert('Такого пользователя нет');
  });

};