const mongoose = require('../modules/mongoose');
const Schema   = mongoose.Schema;
const util     = require('util');

const schema = new Schema({
  username:       {
    type:     String,
    unique:   true,
    required: true
  },
  publicKey:      {
    type:     String,
    unique:   true,
    required: true
  },
  userPictureUrl: {
    type:     String,
    unique:   false,
    required: true
  }
});

schema.static.checkKey = publicKey => {
  return publicKey === this.publicKey;
};

schema.statics.authorize = function (username, key, callback) {

  this.findOne({ username: username, publicKey: key }, (err,user) => {
    if (user === undefined || user === null)
      callback(new AuthError('Неверный логин или пароль'), user);
    else
      callback(err, user);
  });
};

schema.statics.findByName = function (name) {
  return this.findOne({ username: name });
};

exports.User = mongoose.model('User', schema);

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;