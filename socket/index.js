const User    = require('../models/user').User;
const Message = require('../models/message');

module.exports = (server) => {
  io = require('socket.io')(server);
  io.on('connection', (socket) => {

    User.find({}, (err, users) => {
      showActiveUsers(socket, users);
    });

    socket.on('join', (roomName, username, destination) => {

      socket.join(roomName);
      Message.loadDialogMessages(username, destination, (err, result) => {
        io.to(roomName).emit('update messages', result);
      });
    });

    socket.on('send message', (username, message, destination, roomName) => {
      save(username, message, destination, (err) => {
        if (err) {
          console.log(err);
        } else {

          Message.loadDialogMessages(username, destination, (err, result) => {
            io.to(roomName).emit('update messages', result);
          });
        }
      });
      //socket.emit('message', msg); // Лоадер
    });

    socket.on('disconnect', () => {
      io.emit('user disconnected');
    });
  });
};

function showActiveUsers(socket, userList) {      //Приходится конвертить словарь в массив и строку
  const userKeyMap = new Map();                   //А потом обратно, потому что JSON.stringify
  userList.forEach(userEntry => {                 //Не обрабатывает словари и возвращает {}
    const username  = userEntry._doc.username;
    const publicKey = userEntry._doc.publicKey;
    userKeyMap.set(username, publicKey);
  });
  const mapString = JSON.stringify(Array.from(userKeyMap));

  socket.emit('names', mapString);
}

function save(username, message, destination, callback) {
  const data = {
    text:        message,
    destination: destination,
    addresser:   username,
    date:        Date.now()
  };
  Message.saveMessage(data, callback);
}

function broadcastToAll(socket, event) {
  let clients = 0;
  io.sockets.emit(event, {});
}