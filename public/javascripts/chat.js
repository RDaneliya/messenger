const username = document.getElementsByClassName('username-text')[0].textContent;
let destination;
let userKeyMap;
let twoUsersRoomString;

const messageForm   = document.getElementsByClassName('message-form')[0];
const messageInput  = document.getElementsByClassName('message-input')[0];
const messageList   = document.getElementsByClassName('messages')[0];
const sendButton    = document.getElementsByClassName('btn-send')[0];
const nickContainer = document.getElementsByClassName('nick-container')[0];
const chatHolder    = document.getElementsByClassName('chat-holder')[0];
const socket        = io.connect();

socket.on('message', (data) => {
  socket.emit('my other event', { my: 'data' });
});

socket.on('names', userKeyMapString => {
  userKeyMap  = new Map(JSON.parse(userKeyMapString));
  const users = Array.from(userKeyMap.keys());
  displayUsers(users);

  socket.emit('load messages');
});

messageForm.addEventListener('submit', () => {
  event.preventDefault();
  const message = messageInput.value;
  const key     = userKeyMap.get(destination);

  messageInput.value = '';
  console.log(message);
  socket.emit('send message', username, message, destination, twoUsersRoomString);

  socket.on('update messages', (messages) => {
    showMessages(messages, messageList);
  });
  return false;
});

function displayUsers(users) {

  nickContainer.innerHTML = '';
  users.forEach(username => {
    const item     = document.createElement('button');
    item.className = 'btn btn-primary username-btn col-4';
    item.innerHTML = username;
    nickContainer.append(item);
  });

  const buttonArray = document.getElementsByClassName('username-btn');

  Array.prototype.forEach.call(buttonArray, (button) => {
    button.addEventListener('click', () => {
      destination              = button.textContent;
      chatHolder.style.display = 'flex';

      const twoUsersRoomArray = [destination, username].sort(); //Тут я получаю массив из двух юзернеймов и сортирую его
      twoUsersRoomString      = twoUsersRoomArray[0] + twoUsersRoomArray[1];
      //Чтобы у обоих юзеров было одинаковое название комннаты
      socket.emit('join', twoUsersRoomString, username, destination);

      socket.on('update messages', (messages) => {
        showMessages(messages, messageList);
      });
    });
  });
}

function encrypt(message, key) {
  return cryptico.encrypt(message, key);
}

function decrypt(message, key) {
  const cipherWrap = { cipher: message };
  return cryptico.decrypt(cipherWrap, key);
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function showMessages(arrayOfMessages, whereToShow) {
  whereToShow.innerHTML = '';
  arrayOfMessages.forEach(message => {
    const privateKey = JSON.parse(localStorage.getItem('private-key'));
    const li         = document.createElement('li');
    console.log(message);
    li.innerHTML = message.addresser + ': ' + message.text;
    whereToShow.appendChild(li);
  });
}