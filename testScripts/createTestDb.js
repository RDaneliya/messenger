const User     = require('../models/user').User;
const mongoose = require('../modules/mongoose');
const async    = require('async');

const user1 = new User({
  username:       'Admin',
  publicKey:      'Admin',
  userPictureUrl: 'https://i.picsum.photos/id/813/200/200.jpg'
});
const user2 = new User({
  username:       'User',
  publicKey:      'User',
  userPictureUrl: 'https://i.picsum.photos/id/813/200/200.jpg'
});
const user3 = new User({
  username:       'User1',
  publicKey:      'User1',
  userPictureUrl: 'https://i.picsum.photos/id/813/200/200.jpg'
});
const users = [user1, user2, user3];

mongoose.connection.on('open', () => {
  const db = mongoose.connection.db;
  db.dropDatabase(err => {
    if (err) throw err;

    async.parallel([
      callback => user1.save(err => callback(err, user1)),
      callback => user2.save(err => callback(err, user2)),
      callback => user3.save(err => callback(err, user3))
    ], (err, result) => mongoose.disconnect());
  });

});


